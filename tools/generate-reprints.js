const fs = require('fs');
const ts = require('typescript');
const jsdom = require('jsdom');

const processArgs = process.argv.slice(2);
const reprintSetName = processArgs[0];
const reprintFolder = processArgs[1];
const reprintsFileName = processArgs[2];
const setsFolderPath = '../ptcg-server/src/sets';
const cardReplacementsFilePath = '../ptcg-play/src/app/deck/deck-edit/card-replacements.ts';
validateProcessArgs();
const folders = fs.readdirSync(setsFolderPath).filter(r => !r.includes('.'));
const implemented = readImplementedCards();

(async function () {
  const newClassNames = await writeReprints();
  writeIndex(newClassNames);
})();

function readImplementedCards() {
  /** @type {Record<string, { folder: string, file: string, className: string, setName: string, setNumber: string, cardName: string | undefined }} */
  const result = {};

  for (const folder of folders) {
    for (const file of fs.readdirSync(`${setsFolderPath}/${folder}`)) {

      const content = fs.readFileSync(`${setsFolderPath}/${folder}/${file}`, 'utf-8');
      const sourceFile = ts.createSourceFile('file.ts', content, ts.ScriptTarget.ESNext, true);

      /** @type {ts.Visitor} */
      const visitor = (node) => {
        if (ts.isClassDeclaration(node)) {
          const className = node.name?.text;
          const setNumber = node.members.find(m => m.name?.text === 'setNumber')?.initializer?.text;
          const setName = node.members.find(m => m.name?.text === 'set')?.initializer?.text;
          const cardName = node.members.find(m => m.name?.text === 'name')?.initializer?.text;

          if (className && setName && setNumber)
            result[`${setName}/${setNumber}`] = { folder, file, className, cardName, setName, setNumber };
        }

        ts.forEachChild(node, visitor);
      }

      ts.visitNode(sourceFile, visitor);
    }
  }

  return result;
}

async function writeReprints() {
  const newImports = [];
  const newCards = [];
  const newClassNames = [];
  const importReplacements = [];
  const exportReplacements = [];
  const reprints = await getReprintsFromLimitless();

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
    const newClassName = implementation.className + suffix + reprintSetName;
    const cardName = implementation.cardName || escapeQuotes(name);
    const fullName = `${cardName}${suffix} ${reprintSetName}`;
    newImports.push(`import { ${implementation.className}${suffix ? ' as ' + baseClassName : ''} } from "../${implementation.folder}/${removeTsExtension(implementation.file)}";`);
    newCards.push(...[
      `export class ${newClassName} extends ${baseClassName} {`,
      `  public setNumber = '${reprintNumber}';`,
      `  public fullName: string = '${fullName}';`,
      `  public set = '${reprintSetName}';`,
      `}`,
      '',
    ]);
    newClassNames.push(newClassName);

    if (suffix) {
      const realName = `${cardName} ${reprintSetName}`;
      importReplacements.push(`  { from: '${realName} ${reprintNumber}', to: '${fullName} ${reprintNumber}' },`);
      exportReplacements.push(`  { from: '${fullName} ${reprintNumber}', to: '${realName} ${reprintNumber}' },`);
    }
  }

  if (newCards.length) {
    const outputFileName = `${setsFolderPath}/${reprintFolder}/${reprintsFileName}`;
    const lines = fs.existsSync(outputFileName)
      ? fs.readFileSync(outputFileName, 'utf-8').split('\n')
      : [];

    fs.writeFileSync(outputFileName, [
      ...distinct(newImports),
      ...lines,
      ...newCards
    ].join('\n'));
  }

  if (importReplacements.length) {
    const outputFileName = cardReplacementsFilePath;
    const lines = fs.readFileSync(outputFileName, 'utf-8').split('\n');
    let trimmedLines = lines.map(line => line.trim());
    const importReplacementsIndex = trimmedLines.indexOf('];');
    if (importReplacementsIndex > -1)
      lines.splice(importReplacementsIndex, 0, ...importReplacements);

    trimmedLines = lines.map(line => line.trim());
    const exportReplacementsIndex = trimmedLines.lastIndexOf('];');
    if (exportReplacementsIndex > -1)
      lines.splice(exportReplacementsIndex, 0, ...exportReplacements);

    fs.writeFileSync(outputFileName, lines.join('\n'));
  }

  return newClassNames;
}

/** @param {string[]} newClassNames */
function writeIndex(newClassNames) {
  const indexFileName = `${setsFolderPath}/${reprintFolder}/index.ts`;
  const indexLines = fs.readFileSync(indexFileName, 'utf-8').split('\n');
  const newIndexImportLine = `import { ${newClassNames.join(', ')} } from './${removeTsExtension(reprintsFileName)}';`;
  const newIndexCards = newClassNames.map(c => `  new ${c}(),`);
  const lastIndexLine = indexLines.indexOf('];');
  if (lastIndexLine > -1)
    indexLines.splice(lastIndexLine, 0, ...newIndexCards);
  fs.writeFileSync(indexFileName, [
    newIndexImportLine,
    ...indexLines
  ].join('\n'));
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
  console.log(`Example: node ${__filename} SVP set-scarlet-and-violet-promos alt-arts.ts`);
}