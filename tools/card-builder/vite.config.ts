import { defineConfig, type Plugin } from 'vite';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';
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
    const imports = source
      .split('\n')
      .filter(line => line.startsWith('import ') &&
        !line.includes('pokemon-card') &&
        !line.includes('card-types') &&
        !line.includes('effects/effect'))
      .map(normalizeGameImport);
    for (const match of reducer.matchAll(/if\s*\(\s*WAS_ATTACK_USED\(effect,\s*(\d+),\s*this\)\s*\)\s*\{/g)) {
      const branchOpen = reducer.indexOf('{', match.index);
      const branchClose = matchingBrace(reducer, branchOpen);
      const index = Number(match[1]);
      if (branchOpen < 0 || branchClose < 0 || !attackTexts[index]?.trim()) continue;
      results.push({
        source: file.replace(`${serverSetsRoot}/`, ''),
        attackText: attackTexts[index],
        body: reducer.slice(branchOpen + 1, branchClose).trim().split('\n').filter(Boolean),
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
      server.middlewares.use(serveTcgData);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveImplementedCardIds);
      server.middlewares.use(serveServerCardEffects);
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
