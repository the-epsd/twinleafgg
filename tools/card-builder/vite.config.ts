import { defineConfig, type Plugin } from 'vite';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, normalize, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const rootDir = dirname(fileURLToPath(import.meta.url));
const dataRoot = join(rootDir, 'data', 'pokemon-tcg-data');
const implementedCardIdsPath = join(rootDir, '../../ptcg-server/implementedCardIds.json');
const serverSetsRoot = join(rootDir, '../../ptcg-server/src/sets');

interface ServerEffect {
  source: string;
  effectText: string;
  attackText?: string;
  kind: 'attack' | 'power' | 'trainer' | 'energy';
  body: string[];
  imports: string[];
  similarity: number;
  bodyMode?: 'branch' | 'full';
}

function decodeString(value: string): string {
  return value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

function extractStringExpression(expression: string): string {
  return [...expression.matchAll(/'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)"/g)]
    .map(match => decodeString(match[1] ?? match[2] ?? ''))
    .join('');
}

function extractPublicText(source: string): string {
  const match = source.match(/public\s+text(?:\s*:\s*string)?\s*=\s*([\s\S]*?);/);
  return match ? extractStringExpression(match[1]) : '';
}

function normalizeGameImport(line: string): string {
  return line.replace(
    /from ['"][^'"]*\/game(\/[^'"]*)?['"]/,
    (_match, suffix = '') => `from '../../game${suffix}'`
  );
}

function sourceUsesName(source: string, name: string): boolean {
  if (!name || name === '*') return name === '*' && /\*/.test(source);
  if (/^[A-Za-z_$][\w$]*$/.test(name)) {
    return new RegExp(`\\b${name}\\b`).test(source);
  }
  return source.includes(name);
}

function matchingBrace(source: string, open: number): number {
  let depth = 0;
  let quote = '';
  for (let i = open; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === '\\') i++;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
    } else if (char === '{') {
      depth++;
    } else if (char === '}' && --depth === 0) {
      return i;
    }
  }
  return -1;
}

function collectTsFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? collectTsFiles(path) : entry.name.endsWith('.ts') ? [path] : [];
  });
}

function jsonResponse(res: ServerResponse, status: number, value: unknown): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(value));
}

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function toFileName(className: string): string {
  return className
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function findSetDirectory(set: string): string | undefined {
  const candidates = new Set<string>();
  for (const file of collectTsFiles(serverSetsRoot)) {
    const source = readFileSync(file, 'utf8');
    if (new RegExp(`public set(?:\\s*:\\s*string)?\\s*=\\s*['"]${set}['"]`).test(source)) {
      candidates.add(dirname(file));
    }
  }
  if (candidates.size !== 1) return undefined;
  return [...candidates][0];
}

interface ReprintCandidateRecord {
  className: string;
  name: string;
  set: string;
  setNumber: string;
  fullName: string;
  sourcePath: string;
  filePath: string;
}

function extractPublicString(source: string, property: string): string {
  const match = source.match(new RegExp(`public\\s+${property}(?:\\s*:\\s*string)?\\s*=\\s*([\\s\\S]*?);`));
  return match ? extractStringExpression(match[1]) : '';
}

function findReprintCandidates(set: string, name: string, excludeSetNumber = ''): ReprintCandidateRecord[] {
  const directory = findSetDirectory(set);
  const normalizedName = name.trim().toLowerCase();
  const normalizedSetNumber = excludeSetNumber.trim();
  if (!directory || !normalizedName) return [];

  interface ParsedClass {
    className: string;
    extendsName: string;
    classSource: string;
    filePath: string;
  }

  const classes = collectTsFiles(serverSetsRoot).flatMap(filePath => {
      const source = readFileSync(filePath, 'utf8');
      return [...source.matchAll(/^export class\s+([A-Za-z_$][\w$]*)[^\{]*\{/gm)].flatMap(match => {
        if (match.index === undefined) return [];
        const open = source.indexOf('{', match.index);
        const close = open < 0 ? -1 : matchingBrace(source, open);
        if (open < 0 || close < 0) return [];
        const declaration = match[0];
        return [{
          className: match[1],
          extendsName: declaration.match(/\bextends\s+([A-Za-z_$][\w$]*)/)?.[1] || '',
          classSource: source.slice(match.index, close + 1),
          filePath,
        }];
      });
    });
  const classByName = new Map<string, ParsedClass>();
  for (const parsed of classes) {
    if (!classByName.has(parsed.className)) classByName.set(parsed.className, parsed);
  }
  const resolveProperty = (parsed: ParsedClass, property: string, seen = new Set<string>()): string => {
    const own = extractPublicString(parsed.classSource, property);
    if (own || !parsed.extendsName || seen.has(parsed.className)) return own;
    seen.add(parsed.className);
    const parent = classByName.get(parsed.extendsName);
    return parent ? resolveProperty(parent, property, seen) : '';
  };

  return classes
    .filter(parsed => parsed.filePath === directory || parsed.filePath.startsWith(`${directory}${sep}`))
    .map(parsed => {
      const cardName = resolveProperty(parsed, 'name');
      const cardSet = resolveProperty(parsed, 'set').toUpperCase();
      const setNumber = extractPublicString(parsed.classSource, 'setNumber');
      return {
        className: parsed.className,
        name: cardName,
        set: cardSet,
        setNumber,
        fullName: extractPublicString(parsed.classSource, 'fullName') || resolveProperty(parsed, 'fullName'),
        sourcePath: relative(serverSetsRoot, parsed.filePath).replaceAll(sep, '/'),
        filePath: parsed.filePath,
      };
    })
    .filter(candidate => {
      if (candidate.set !== set || candidate.name.trim().toLowerCase() !== normalizedName) return false;
      return !(normalizedSetNumber && candidate.setNumber === normalizedSetNumber);
    })
    .filter((candidate, index, all) => all.findIndex(other =>
      other.className === candidate.className && other.sourcePath === candidate.sourcePath
    ) === index)
    .sort((a, b) => a.set.localeCompare(b.set));
}

function serveReprintCandidates(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  if (req.url?.split('?')[0] !== '/reprint-candidates' || req.method !== 'GET') {
    next();
    return;
  }
  const url = new URL(req.url, 'http://localhost');
  const set = url.searchParams.get('set')?.trim().toUpperCase() || '';
  const name = url.searchParams.get('name')?.trim() || '';
  const excludeSetNumber = url.searchParams.get('excludeSetNumber')?.trim() || '';
  if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(set) || !name) {
    jsonResponse(res, 400, { error: 'Set code and card name are required.' });
    return;
  }
  jsonResponse(res, 200, {
    candidates: findReprintCandidates(set, name, excludeSetNumber).map(({ filePath: _filePath, ...candidate }) => candidate),
  });
}

function normalizeSavedSource(source: string, cardDirectory: string): string {
  const gameDirectory = join(serverSetsRoot, '../game');
  const gameImportBase = relative(cardDirectory, gameDirectory).replaceAll(sep, '/');
  const importBase = gameImportBase.startsWith('.') ? gameImportBase : `./${gameImportBase}`;
  const imports = new Map<string, Set<string>>();
  const otherImports: string[] = [];
  const body = source.replace(/^import \{ ([^}]+) \} from ['"]([^'"]+)['"];?\s*$/gm, (_line, names: string, module: string) => {
    const normalizedModule = module.includes('/game')
      ? `${importBase}${module.slice(module.indexOf('/game') + '/game'.length)}`
      : module;
    const current = imports.get(normalizedModule) ?? new Set<string>();
    names.split(',').map(name => name.trim()).filter(Boolean).forEach(name => current.add(name));
    imports.set(normalizedModule, current);
    return '';
  });
  const remaining = body.match(/^import .+$/gm) ?? [];
  otherImports.push(...remaining);
  const code = body.replace(/^import .+$/gm, '');
  const generatedImports = [...imports.entries()]
    .map(([module, names]) => {
      const used = [...names].filter(name => sourceUsesName(code, name));
      return used.length > 0 ? `import { ${used.sort().join(', ')} } from '${module}';` : '';
    })
    .filter(Boolean);
  return [
    ...generatedImports,
    ...otherImports,
    '',
    body.replace(/^import .+$/gm, '').trimStart(),
  ].join('\n');
}

function addCardToSetIndex(indexPath: string, className: string, fileName: string): void {
  const source = readFileSync(indexPath, 'utf8');
  const importLine = `import { ${className} } from './${fileName}';`;
  const hasImport = new RegExp(`import \\{\\s*${className}\\s*\\} from '\\./`).test(source);
  const hasCard = new RegExp(`new ${className}\\(\\)`).test(source);
  let updated = source;

  if (!hasImport) {
    const importLines = [...updated.matchAll(/^import \{ ([^}]+) \} from '\.\/([^']+)';$/gm)];
    const nextImport = importLines.find(match => match[1].trim().localeCompare(className) > 0);
    if (nextImport) {
      updated = updated.slice(0, nextImport.index) + `${importLine}\n` + updated.slice(nextImport.index);
    } else {
      const exportIndex = updated.indexOf('export const');
      updated = `${updated.slice(0, exportIndex)}${importLine}\n${updated.slice(exportIndex)}`;
    }
  }

  if (!hasCard) {
    const otherPrintsIndex = updated.indexOf('  // Other Prints');
    const beforeOtherPrints = otherPrintsIndex >= 0 ? updated.slice(0, otherPrintsIndex) : updated;
    const cardLines = [...beforeOtherPrints.matchAll(/^ {2}new ([A-Za-z0-9_]+)\(\),$/gm)];
    const nextCard = cardLines.find(match => match[1].localeCompare(className) > 0);
    const cardLine = `  new ${className}(),\n`;
    if (nextCard) {
      updated = updated.slice(0, nextCard.index) + cardLine + updated.slice(nextCard.index);
    } else if (otherPrintsIndex >= 0) {
      updated = updated.slice(0, otherPrintsIndex) + cardLine + updated.slice(otherPrintsIndex);
    } else {
      const closingIndex = updated.lastIndexOf('];');
      updated = updated.slice(0, closingIndex) + cardLine + updated.slice(closingIndex);
    }
  }

  if (updated !== source) writeFileSync(indexPath, updated, 'utf8');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasExportedClass(source: string, className: string): boolean {
  return new RegExp(`export class\\s+${escapeRegExp(className)}\\b`).test(source);
}

function splitImportLines(source: string): { imports: string[]; body: string } {
  const imports: string[] = [];
  const body: string[] = [];
  for (const line of source.split('\n')) {
    if (/^\s*import\s/.test(line) && /;\s*$/.test(line)) {
      imports.push(line.trim());
    } else {
      body.push(line);
    }
  }
  return { imports, body: body.join('\n') };
}

function appendOrReplaceExportedClass(source: string, className: string, replacement: string): string {
  const sourceParts = splitImportLines(source);
  const replacementParts = splitImportLines(replacement);
  const imports = [...new Set([...sourceParts.imports, ...replacementParts.imports])];
  const body = sourceParts.body;
  const replacementBody = replacementParts.body;
  const match = new RegExp(`export class\\s+${escapeRegExp(className)}\\b`).exec(body);
  let updatedBody: string;
  if (!match || match.index === undefined) {
    updatedBody = `${body.trimEnd()}\n\n${replacementBody.trim()}`;
  } else {
    const open = body.indexOf('{', match.index);
    const close = open < 0 ? -1 : matchingBrace(body, open);
    if (open < 0 || close < 0) throw new Error(`Could not locate the ${className} class body.`);
    updatedBody = `${body.slice(0, match.index).trimEnd()}\n\n${replacementBody.trim()}${body.slice(close + 1)}`;
  }
  return `${imports.length ? `${imports.join('\n')}\n\n` : ''}${updatedBody.trimStart()}\n`;
}

function uniqueReprintClassName(directory: string, requested: string, set: string, setNumber: string, existingOtherPrints: string): string {
  if (hasExportedClass(existingOtherPrints, requested)) return requested;
  const occupied = collectTsFiles(directory).some(file => hasExportedClass(readFileSync(file, 'utf8'), requested));
  if (!occupied) return requested;
  const suffix = `${set}${setNumber}`.replace(/[^A-Za-z0-9]/g, '');
  let candidate = `${requested}${suffix}`;
  let index = 2;
  while (collectTsFiles(directory).some(file => hasExportedClass(readFileSync(file, 'utf8'), candidate))) {
    candidate = `${requested}${suffix}${index++}`;
  }
  return candidate;
}

function buildReprintSource(
  candidate: ReprintCandidateRecord,
  directory: string,
  className: string,
  payload: { set: string; setNumber: string; fullName: string; regulationMark?: string }
): string {
  const modulePath = relative(directory, candidate.filePath).replaceAll(sep, '/').replace(/\.ts$/, '');
  const importPath = modulePath.startsWith('.') ? modulePath : `./${modulePath}`;
  const quote = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const lines = [
    `import { ${candidate.className} } from '${importPath}';`,
    '',
    `export class ${className} extends ${candidate.className} {`,
  ];
  if (payload.regulationMark?.trim()) lines.push(`  public regulationMark = ${quote(payload.regulationMark.trim())};`);
  lines.push(
    `  public setNumber = ${quote(payload.setNumber.trim())};`,
    `  public fullName = ${quote(payload.fullName.trim())};`,
    `  public set = ${quote(payload.set.trim().toUpperCase())};`,
    '}',
  );
  return lines.join('\n');
}

async function serveSaveCard(req: IncomingMessage, res: ServerResponse, next: () => void): Promise<void> {
  if (req.url?.split('?')[0] !== '/save-card' || req.method !== 'POST') {
    next();
    return;
  }

  try {
    const payload = JSON.parse(await readRequestBody(req)) as {
      set?: string;
      className?: string;
      source?: string;
      overwrite?: boolean;
      reprint?: {
        className: string;
        sourceClassName: string;
        sourcePath: string;
        name: string;
        set: string;
        setNumber: string;
        fullName: string;
        regulationMark?: string;
      };
    };
    const set = payload.set?.trim().toUpperCase() || '';
    const className = payload.className?.trim() || '';
    if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(set) || !/^[A-Za-z][A-Za-z0-9]*$/.test(className)) {
      jsonResponse(res, 400, { error: 'Set code or class name is invalid.' });
      return;
    }
    if (!payload.source?.trim() && !payload.reprint) {
      jsonResponse(res, 400, { error: 'Generated source is empty.' });
      return;
    }
    const directory = findSetDirectory(set);
    if (!directory) {
      jsonResponse(res, 404, { error: `Could not find a unique ptcg-server set folder for ${set}.` });
      return;
    }
    if (payload.reprint) {
      const reprint = payload.reprint;
      const requiredReprintFields = [
        reprint.className,
        reprint.sourceClassName,
        reprint.sourcePath,
        reprint.name,
        reprint.set,
        reprint.setNumber,
        reprint.fullName,
      ];
      if (
        requiredReprintFields.some(value => typeof value !== 'string') ||
        !/^[A-Za-z][A-Za-z0-9]*$/.test(reprint.className) ||
        !reprint.name.trim()
      ) {
        jsonResponse(res, 400, { error: 'Reprint metadata is invalid.' });
        return;
      }
      const candidate = findReprintCandidates(set, reprint.name, '').find(
        item => item.className === reprint.sourceClassName && item.sourcePath === reprint.sourcePath
      );
      if (!candidate) {
        jsonResponse(res, 400, { error: 'The selected reprint source is no longer available.' });
        return;
      }
      const otherPrintsPath = join(directory, 'other-prints.ts');
      const existingOtherPrints = existsSync(otherPrintsPath) ? readFileSync(otherPrintsPath, 'utf8') : '';
      const savedClassName = uniqueReprintClassName(directory, reprint.className, set, reprint.setNumber, existingOtherPrints);
      if (hasExportedClass(existingOtherPrints, savedClassName) && !payload.overwrite) {
        jsonResponse(res, 409, { error: 'That reprint class already exists.', path: otherPrintsPath });
        return;
      }
      const wrapper = buildReprintSource(candidate, directory, savedClassName, reprint);
      const updatedOtherPrints = appendOrReplaceExportedClass(existingOtherPrints, savedClassName, wrapper);
      writeFileSync(otherPrintsPath, updatedOtherPrints, 'utf8');
      addCardToSetIndex(join(directory, 'index.ts'), savedClassName, 'other-prints');
      jsonResponse(res, 200, {
        message: `Saved ${savedClassName} to ${otherPrintsPath.replace(`${serverSetsRoot}/`, '')}`,
        path: otherPrintsPath,
        className: savedClassName,
      });
      return;
    }

    const filePath = join(directory, `${toFileName(className)}.ts`);
    if (existsSync(filePath) && !payload.overwrite) {
      jsonResponse(res, 409, { error: 'File already exists.', path: filePath });
      return;
    }
    writeFileSync(filePath, normalizeSavedSource(payload.source, directory), 'utf8');
    addCardToSetIndex(join(directory, 'index.ts'), className, toFileName(className));
    jsonResponse(res, 200, {
      message: `Saved ${filePath.replace(`${serverSetsRoot}/`, '')}`,
      path: filePath,
    });
  } catch (error) {
    jsonResponse(res, 400, { error: error instanceof Error ? error.message : String(error) });
  }
}

function extractReducerBody(source: string): string | undefined {
  const reducerStart = source.indexOf('public reduceEffect(');
  if (reducerStart < 0) return undefined;
  const open = source.indexOf('{', reducerStart);
  const close = open < 0 ? -1 : matchingBrace(source, open);
  return close < 0 ? undefined : source.slice(open + 1, close);
}

function extractBranchBody(reducer: string, pattern: RegExp): string[] | undefined {
  const match = reducer.match(pattern);
  if (!match || match.index === undefined) return undefined;
  const branchOpen = reducer.indexOf('{', match.index);
  const branchClose = matchingBrace(reducer, branchOpen);
  if (branchOpen < 0 || branchClose < 0) return undefined;
  let body = reducer.slice(branchOpen + 1, branchClose).trim().split('\n').filter(Boolean);
  if (body.some(line => /\bplayer\b/.test(line.replace(/const player = effect\.player;/, '')))) {
    body = body.filter(line => !/const player = effect\.player;/.test(line));
    body.unshift('const player = effect.player;');
  } else {
    body = body.filter(line => !/const player = effect\.player;/.test(line));
  }
  return body;
}

function extractHelperFunctions(source: string): string[] {
  const classStart = source.indexOf('export class ');
  if (classStart < 0) return [];
  const sourceClass = source.slice(classStart).match(/export class\s+([A-Za-z_$][\w$]*)/)?.[1];
  const prefix = source.slice(0, classStart);
  const helpers: string[] = [];
  const pattern = /(?:async\s+)?function\s*\*?\s+[A-Za-z_$][\w$]*\s*\(/g;
  for (const match of prefix.matchAll(pattern)) {
    if (match.index === undefined) continue;
    const open = source.indexOf('{', match.index);
    const close = open < 0 ? -1 : matchingBrace(source, open);
    if (close >= 0) {
      const helper = source.slice(match.index, close + 1).trim();
      helpers.push(sourceClass ? helper.replace(new RegExp(`\\b${sourceClass}\\b`, 'g'), 'any') : helper);
    }
  }
  return helpers;
}

function extractArrayTexts(source: string, property: string, until: number): string[] {
  const start = source.indexOf(property);
  if (start < 0 || start >= until) return [];
  const boundaries = ['public attacks', 'public powers', 'public set', 'public reduceEffect(']
    .map(value => source.indexOf(value, start + property.length))
    .filter(index => index >= 0 && index < until);
  const end = boundaries.length > 0 ? Math.min(...boundaries) : until;
  const section = source.slice(start, end);
  return [...section.matchAll(/text\s*:\s*'((?:\\.|[^'])*)'|text\s*:\s*"((?:\\.|[^"])*)"/g)]
    .map(match => decodeString(match[1] ?? match[2] ?? ''));
}

function buildEffectImports(source: string, body: string, kind: ServerEffect['kind']): string[] {
  const imports = source
    .split('\n')
    .filter(line => line.startsWith('import '))
    .filter(line => /^import .+ from ['"]/.test(line))
    .filter(line => !line.includes('/card/pokemon-card') && !line.includes('/card/trainer-card') &&
      !line.includes('/card/energy-card') && !line.includes('effects/effect'))
    .map(normalizeGameImport)
    .map(line => {
      const importMatch = line.match(/^import \{ ([^}]+) \} from/);
      if (!importMatch) return line;
      const names = importMatch[1].split(',').map(name => name.trim())
        .filter(name => sourceUsesName(body, name));
      return names.length > 0 ? line.replace(importMatch[1], names.join(', ')) : '';
    })
    .filter(line => Boolean(line) && !/^import \{\s*\}?\s*;?$/.test(line));
  const markerImport = kind === 'attack'
    ? `import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';`
    : kind === 'power'
      ? `import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';`
      : kind === 'trainer'
        ? `import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';`
        : '';
  if (markerImport && !imports.some(line => line.includes(kind === 'trainer' ? 'WAS_TRAINER_USED' : kind === 'power' ? 'WAS_POWER_USED' : 'WAS_ATTACK_USED'))) {
    imports.push(markerImport);
  }
  return imports;
}

function addServerEffect(
  results: ServerEffect[],
  file: string,
  source: string,
  effectText: string,
  body: string[],
  kind: ServerEffect['kind'],
  bodyMode: ServerEffect['bodyMode'] = 'branch',
  helpers: string[] = [],
): void {
  if (!effectText.trim() || body.length === 0) return;
  results.push({
    source: file.replace(`${serverSetsRoot}/`, ''),
    effectText,
    attackText: effectText,
    kind,
    body,
    imports: buildEffectImports(source, `${body.join('\n')}\n${helpers.join('\n')}`, kind),
    similarity: 1,
    bodyMode,
    helpers,
  });
}

function buildServerEffects(): ServerEffect[] {
  const results: ServerEffect[] = [];
  for (const file of collectTsFiles(serverSetsRoot)) {
    const source = readFileSync(file, 'utf8');
    const reducer = extractReducerBody(source);
    if (!reducer) continue;
    const reducerStart = source.indexOf('public reduceEffect(');
    const helpers = extractHelperFunctions(source);

    if (source.includes('extends PokemonCard')) {
      const attackTexts = extractArrayTexts(source, 'public attacks', reducerStart);
      for (const match of reducer.matchAll(/if\s*\(\s*WAS_ATTACK_USED\(effect,\s*(\d+),\s*this\)\s*\)\s*\{/g)) {
        const body = extractBranchBody(reducer.slice(match.index ?? 0), /^if\s*\(/);
        const index = Number(match[1]);
        if (body) addServerEffect(results, file, source, attackTexts[index] || '', body, 'attack', 'branch', helpers);
      }

      const powerTexts = extractArrayTexts(source, 'public powers', reducerStart);
      for (const match of reducer.matchAll(/if\s*\(\s*WAS_POWER_USED\(effect,\s*(\d+),\s*this\)\s*\)\s*\{/g)) {
        const body = extractBranchBody(reducer.slice(match.index ?? 0), /^if\s*\(/);
        const index = Number(match[1]);
        if (body) addServerEffect(results, file, source, powerTexts[index] || '', body, 'power', 'branch', helpers);
      }
    }

    if (source.includes('extends TrainerCard')) {
      const text = extractPublicText(source);
      const trainerBody = extractBranchBody(reducer, /if\s*\(\s*WAS_TRAINER_USED\(effect,\s*this\)\s*\)\s*\{|if\s*\(\s*effect\s+instanceof\s+TrainerEffect\s*&&\s*effect\.trainerCard\s*===\s*this\s*\)\s*\{/);
      if (trainerBody) {
        addServerEffect(results, file, source, text, trainerBody, 'trainer', 'branch', helpers);
      } else {
        addServerEffect(results, file, source, text, reducer.trim().split('\n').filter(Boolean), 'trainer', 'full', helpers);
      }
    }

    if (source.includes('extends EnergyCard')) {
      const text = extractPublicText(source);
      addServerEffect(results, file, source, text, reducer.trim().split('\n').filter(Boolean), 'energy', 'full', helpers);
    }
  }
  return results;
}

function serveServerCardEffects(req: IncomingMessage, res: ServerResponse, next: () => void): void {
  if (req.url?.split('?')[0] !== '/server-card-effects.json') {
    next();
    return;
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(buildServerEffects()));
}

function serveImplementedCardIds(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void {
  const pathOnly = req.url?.split('?')[0];
  if (pathOnly !== '/implemented-card-ids.json') {
    next();
    return;
  }

  if (!existsSync(implementedCardIdsPath)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'implementedCardIds.json missing',
        hint: 'From ptcg-server: node generate-implemented-card-ids-json.js',
      })
    );
    return;
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(readFileSync(implementedCardIdsPath));
}

function serveTcgData(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void {
  if (!req.url?.startsWith('/tcg-data/')) {
    next();
    return;
  }

  if (!existsSync(dataRoot)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'pokemon-tcg-data not synced',
        hint: 'Run npm run sync-data in tools/card-builder',
      })
    );
    return;
  }

  const rel = decodeURIComponent(req.url.replace(/^\/tcg-data\/?/, '').split('?')[0]);
  const filePath = normalize(join(dataRoot, rel));
  if (!filePath.startsWith(dataRoot + sep) && filePath !== dataRoot) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  try {
    if (!statSync(filePath).isFile()) {
      res.statusCode = 404;
      res.end(`Not found: ${rel}`);
      return;
    }
    const buf = readFileSync(filePath);
    if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(buf);
  } catch {
    res.statusCode = 404;
    res.end(`Not found: ${rel}`);
  }
}

function tcgDataPlugin(): Plugin {
  return {
    name: 'tcg-data-static',
    configureServer(server) {
      server.middlewares.use(serveImplementedCardIds);
      server.middlewares.use(serveServerCardEffects);
      server.middlewares.use(serveReprintCandidates);
      server.middlewares.use(serveSaveCard);
      server.middlewares.use(serveTcgData);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveImplementedCardIds);
      server.middlewares.use(serveServerCardEffects);
      server.middlewares.use(serveReprintCandidates);
      server.middlewares.use(serveSaveCard);
      server.middlewares.use(serveTcgData);
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [tcgDataPlugin()],
  server: {
    port: 5174,
    open: true,
    fs: {
      allow: ['.', join(rootDir, 'data'), join(rootDir, '../../ptcg-server')],
    },
  },
  preview: {
    port: 5174,
  },
});
