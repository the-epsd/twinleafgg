const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const jsdom = require('jsdom');

const processArgs = process.argv.slice(2);
const reprintSetName = processArgs[0];
const reprintFolder = processArgs[1];
const reprintsFileName = processArgs[2];
const setsFolderPath = '../ptcg-server/src/sets';
validateProcessArgs();
const reprintSetPath = `${setsFolderPath}/${reprintFolder}`;
const implemented = readImplementedCards();
const existingSetClassNames = readExistingSetClassNames();

(async function () {
  const newClassNames = await writeReprints();
  writeIndex(newClassNames);
})();

function readImplementedCards() {
  /** @type {Record<string, { importPath: string, className: string, setName: string, setNumber: string, cardName: string | undefined }>} */
  const result = {};

  /** @param {string} dir */
  function scanDirectory(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const filePath = path.join(dir, entry);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        if (entry === 'node_modules' || entry === 'tests')
          continue;

        scanDirectory(filePath);
        continue;
      }

      if (!entry.endsWith('.ts') || entry === 'index.ts')
        continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      const sourceFile = ts.createSourceFile('file.ts', content, ts.ScriptTarget.ESNext, true);
      const importPath = toImportPath(filePath);

      /** @type {ts.Visitor} */
      const visitor = (node) => {
        if (ts.isClassDeclaration(node)) {
          const className = node.name?.text;
          const setNumber = getStringLiteralValue(node.members.find(m => m.name?.text === 'setNumber')?.initializer);
          const setName = getStringLiteralValue(node.members.find(m => m.name?.text === 'set')?.initializer);
          const cardName = getStringLiteralValue(node.members.find(m => m.name?.text === 'name')?.initializer);

          if (className && setName && setNumber)
            result[`${setName}/${setNumber}`] = { importPath, className, cardName, setName, setNumber };
        }

        ts.forEachChild(node, visitor);
      }

      ts.visitNode(sourceFile, visitor);
    }
  }

  scanDirectory(setsFolderPath);
  return result;
}

/** @param {ts.Expression | undefined} node */
function getStringLiteralValue(node) {
  if (!node)
    return undefined;

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text;

  return undefined;
}

/** @param {string} filePath */
function toImportPath(filePath) {
  const relativePath = path.relative(reprintSetPath, filePath).replace(/\\/g, '/');
  return relativePath.replace(/\.ts$/, '');
}

async function writeReprints() {
  const newImports = [];
  const newCards = [];
  const newClassNames = [];
  const reprints = await getReprintsFromLimitless();
  const outputFileName = `${setsFolderPath}/${reprintFolder}/${reprintsFileName}`;
  const existingOutput = fs.existsSync(outputFileName)
    ? fs.readFileSync(outputFileName, 'utf-8')
    : '';
  const existingClassNames = getExistingClassNames(existingOutput);

  for (const [reprintNumber, cardInfo] of Object.entries(reprints)) {
    if (implemented[`${reprintSetName}/${reprintNumber}`])
      continue;

    let { name, suffix, reprints } = cardInfo;
    const implementations = reprints.map(reprint => implemented[reprint]).filter(Boolean);
    if (!implementations.length)
      continue;

    // Prefer original implementation if available
    const implementation = implementations.find(imp => imp.cardName) || implementations[0];

    suffix = suffix || '';
    const baseClassName = implementation.className + (suffix ? implementation.setName + implementation.setNumber : '');
    let classSuffix = suffix;
    let newClassName = implementation.className + classSuffix + reprintSetName;

    while (existingSetClassNames.has(newClassName) || existingClassNames.has(newClassName)) {
      const nextSuffix = classSuffix ? Number(classSuffix) + 1 : 2;
      classSuffix = String(nextSuffix);
      newClassName = implementation.className + classSuffix + reprintSetName;
    }

    if (existingClassNames.has(newClassName))
      continue;

    const rawCardName = implementation.cardName || name;
    const fullName = escapeQuotes(`${rawCardName}${classSuffix} ${reprintSetName}`);
    newImports.push(`import { ${implementation.className}${suffix ? ' as ' + baseClassName : ''} } from '${implementation.importPath.startsWith('.') ? implementation.importPath : './' + implementation.importPath}';`);
    newCards.push(...[
      `export class ${newClassName} extends ${baseClassName} {`,
      `  public setNumber = '${reprintNumber}';`,
      `  public fullName: string = '${fullName}';`,
      `  public set = '${reprintSetName}';`,
      `}`,
      '',
    ]);
    newClassNames.push(newClassName);
    existingSetClassNames.add(newClassName);
    existingClassNames.add(newClassName);
  }

  if (newCards.length) {
    const lines = existingOutput ? existingOutput.split('\n') : [];

    fs.writeFileSync(outputFileName, [
      ...distinct(newImports),
      ...lines,
      ...newCards
    ].join('\n'));
  }

  console.log(`Added ${newClassNames.length} reprint(s) to ${reprintsFileName}`);
  if (newClassNames.length)
    console.log(newClassNames.join(', '));

  return newClassNames;
}

/** @param {string[]} newClassNames */
function writeIndex(newClassNames) {
  if (!newClassNames.length)
    return;

  const indexFileName = `${setsFolderPath}/${reprintFolder}/index.ts`;
  const indexContent = fs.readFileSync(indexFileName, 'utf-8');
  const indexLines = indexContent.split('\n');
  const reprintsModule = removeTsExtension(reprintsFileName);
  const classesToAdd = newClassNames.filter(className =>
    !indexContent.includes(`new ${className}(`) && !indexContent.includes(`${className},`)
  );

  if (!classesToAdd.length)
    return;

  const existingImportLine = indexLines.find(line =>
    line.startsWith(`import {`) && line.includes(`from './${reprintsModule}'`)
  );

  if (existingImportLine) {
    const importIndex = indexLines.indexOf(existingImportLine);
    const importedClasses = existingImportLine
      .replace(`import {`, '')
      .replace(`} from './${reprintsModule}';`, '')
      .split(',')
      .map(x => x.trim())
      .filter(Boolean);
    indexLines[importIndex] = `import { ${distinct([...importedClasses, ...classesToAdd]).join(', ')} } from './${reprintsModule}';`;
  } else {
    indexLines.unshift(`import { ${classesToAdd.join(', ')} } from './${reprintsModule}';`);
  }

  const newIndexCards = classesToAdd.map(c => `  new ${c}(),`);
  const lastIndexLine = indexLines.indexOf('];');
  if (lastIndexLine > -1)
    indexLines.splice(lastIndexLine, 0, ...newIndexCards);

  fs.writeFileSync(indexFileName, indexLines.join('\n'));
}

function readExistingSetClassNames() {
  const classNames = new Set();

  /** @param {string} dir */
  function scanDirectory(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const filePath = path.join(dir, entry);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        scanDirectory(filePath);
        continue;
      }

      if (!entry.endsWith('.ts'))
        continue;

      for (const className of getExistingClassNames(fs.readFileSync(filePath, 'utf-8')))
        classNames.add(className);
    }
  }

  scanDirectory(reprintSetPath);
  return classNames;
}

/** @param {string} content */
function getExistingClassNames(content) {
  const classNames = new Set();
  const matches = content.matchAll(/^export class (\w+)/gm);

  for (const match of matches)
    classNames.add(match[1]);

  return classNames;
}

function distinct(array) {
  return Array.from(new Set(array));
}

/** @param {string} value */
function escapeQuotes(value) {
  return value.replace(/'/g, "\\'");
}

/** @param {string} fileName */
function removeTsExtension(fileName) {
  return fileName.replace('.ts', '')
}

async function getReprintsFromLimitless() {
  const url = `https://limitlesstcg.com/cards/${reprintSetName}?display=full`;
  try {
    const dom = await jsdom.JSDOM.fromURL(url);
    const document = dom.window.document;
    /** @type {{ [cardNumber: string]: { name: string; reprints: string[]; suffix?: number } }} */
    let cards = {};
    let allNames = Array.from(document.querySelectorAll('.card-page-main .card-text-name'), x => x.textContent);
    Array.from(document.querySelectorAll('.card-page-main')).forEach((e, index) => {
      let name = e.querySelector('.card-text-name').textContent;
      let occurenceCount = allNames.slice(0, index).filter(n => n === name).length;
      let suffix = occurenceCount ? occurenceCount + 1 : '';
      let cardNumber = e.querySelector('.card-text-name a').pathname.split('/').at(-1);
      let reprints = Array
        .from(e.querySelectorAll('.card-prints-versions a[href^="/cards/"]'))
        .filter(x => !x.pathname.includes('/jp/'))
        .map(x => x.pathname.split('/').slice(-2).join('/'));

      if (reprints.length) {
        let card = { name, reprints };
        if (suffix)
          card.suffix = suffix;

        cards[cardNumber] = card;
      }
    });

    return cards;
  } catch {
    console.log(`Couldn't get reprints from ${url}`);
    process.exit(-1);
  }
}

function validateProcessArgs() {
  if (processArgs.filter(Boolean).length !== 3) {
    printUsage();
    process.exit(-1);
  }

  if (!fs.existsSync(`${setsFolderPath}/${reprintFolder}`)) {
    console.log(`${setsFolderPath}/${reprintFolder} doesn't exist`);
    printUsage();
    process.exit(-1);
  }
}

function printUsage() {
  console.log(`Usage: node ${__filename} limitlessSetCode setFolderName outputFileName`);
  console.log(`Example: node ${__filename} SVP 10-scarlet-and-violet/set-scarlet-and-violet-promos other-prints.ts`);
}