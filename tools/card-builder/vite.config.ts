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
  attackText: string;
  body: string[];
  imports: string[];
  similarity: number;
}

function decodeString(value: string): string {
  return value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
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
    };
    const set = payload.set?.trim().toUpperCase() || '';
    const className = payload.className?.trim() || '';
    if (!/^[A-Z0-9][A-Z0-9_-]*$/.test(set) || !/^[A-Za-z][A-Za-z0-9]*$/.test(className)) {
      jsonResponse(res, 400, { error: 'Set code or class name is invalid.' });
      return;
    }
    if (!payload.source?.trim()) {
      jsonResponse(res, 400, { error: 'Generated source is empty.' });
      return;
    }
    const directory = findSetDirectory(set);
    if (!directory) {
      jsonResponse(res, 404, { error: `Could not find a unique ptcg-server set folder for ${set}.` });
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

function buildServerEffects(): ServerEffect[] {
  const results: ServerEffect[] = [];
  for (const file of collectTsFiles(serverSetsRoot)) {
    const source = readFileSync(file, 'utf8');
    const attacksStart = source.indexOf('public attacks');
    const reducerStart = source.indexOf('public reduceEffect(');
    if (attacksStart < 0 || reducerStart < 0 || attacksStart >= reducerStart) continue;
    const attackSection = source.slice(attacksStart, reducerStart);
    const attackTexts = [...attackSection.matchAll(/text:\s*'((?:\\.|[^'])*)'/g)]
      .map(match => decodeString(match[1]));
    const open = source.indexOf('{', reducerStart);
    const close = open < 0 ? -1 : matchingBrace(source, open);
    if (close < 0) continue;
    const reducer = source.slice(open + 1, close);
    for (const match of reducer.matchAll(/if\s*\(\s*WAS_ATTACK_USED\(effect,\s*(\d+),\s*this\)\s*\)\s*\{/g)) {
      const branchOpen = reducer.indexOf('{', match.index);
      const branchClose = matchingBrace(reducer, branchOpen);
      const index = Number(match[1]);
      if (branchOpen < 0 || branchClose < 0 || !attackTexts[index]?.trim()) continue;
      let branchBody = reducer.slice(branchOpen + 1, branchClose).trim().split('\n').filter(Boolean);
      if (branchBody.some(line => /\bplayer\b/.test(line.replace(/const player = effect\.player;/, '')))) {
        branchBody = branchBody.filter(line => !/const player = effect\.player;/.test(line));
        branchBody.unshift('const player = effect.player;');
      } else {
        branchBody = branchBody.filter(line => !/const player = effect\.player;/.test(line));
      }
      const branchCode = branchBody.join('\n');
      const imports = source
        .split('\n')
        .filter(line => line.startsWith('import ') &&
          !line.includes('pokemon-card') &&
          !line.includes('effects/effect'))
        .map(normalizeGameImport)
        .map(line => {
          const importMatch = line.match(/^import \{ ([^}]+) \} from/);
          if (!importMatch) return line;
          const names = importMatch[1].split(',').map(name => name.trim())
            .filter(name => sourceUsesName(branchCode, name));
          return names.length > 0 ? line.replace(importMatch[1], names.join(', ')) : '';
        })
        .filter(Boolean);
      if (!imports.some(line => line.includes('WAS_ATTACK_USED'))) {
        imports.push(`import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';`);
      }
      results.push({
        source: file.replace(`${serverSetsRoot}/`, ''),
        attackText: attackTexts[index],
        body: branchBody,
        imports,
        similarity: 1,
      });
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
      server.middlewares.use(serveSaveCard);
      server.middlewares.use(serveTcgData);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveImplementedCardIds);
      server.middlewares.use(serveServerCardEffects);
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
