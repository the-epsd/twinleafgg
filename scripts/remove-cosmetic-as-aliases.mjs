#!/usr/bin/env node
/**
 * Strip cosmetic `import { Foo as FooSET## }` aliases from other-prints / full-art / alt-arts.
 * Keep `as` only when the same original binding name is imported more than once in a file.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('ptcg-server/src/sets');
const TARGET_NAMES = new Set(['other-prints.ts', 'full-art.ts', 'alt-arts.ts']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (TARGET_NAMES.has(ent.name)) out.push(p);
  }
  return out;
}

/** Parse named import specs: `{ A, B as C, type D }` */
function parseSpecs(specText) {
  const specs = [];
  // Split on commas not inside nested braces (none expected)
  for (const part of specText.split(',')) {
    const raw = part.trim();
    if (!raw) continue;
    const typePrefix = raw.startsWith('type ');
    const body = typePrefix ? raw.slice(5).trim() : raw;
    const m = body.match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
    if (!m) {
      specs.push({ raw, unparsed: true });
      continue;
    }
    specs.push({
      original: m[1],
      local: m[2] || m[1],
      aliased: Boolean(m[2]),
      typePrefix,
      unparsed: false,
    });
  }
  return specs;
}

function formatSpecs(specs) {
  return specs
    .map((s) => {
      if (s.unparsed) return s.raw;
      const type = s.typePrefix ? 'type ' : '';
      if (s.aliased && s.local !== s.original) {
        return `${type}${s.original} as ${s.local}`;
      }
      return `${type}${s.original}`;
    })
    .join(', ');
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let content = original;

  // Collect all named imports (possibly multi-line)
  const importRe =
    /^import\s+(type\s+)?\{([^}]*)\}\s+from\s+(['"][^'"]+['"]);?\s*$/gm;

  /** @type {{ full: string, typeImport: boolean, specs: ReturnType<typeof parseSpecs>, from: string, start: number, end: number }[]} */
  const imports = [];
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const specs = parseSpecs(m[2]);
    imports.push({
      full: m[0],
      typeImport: Boolean(m[1]),
      specs,
      from: m[3],
      start: m.index,
      end: m.index + m[0].length,
    });
  }

  // Collision = same original binding imported from 2+ distinct module paths
  const originalToPaths = new Map();
  for (const imp of imports) {
    for (const s of imp.specs) {
      if (s.unparsed) continue;
      if (!originalToPaths.has(s.original)) originalToPaths.set(s.original, new Set());
      // Normalize quotes so 'path' and "path" count as the same module
      originalToPaths.get(s.original).add(imp.from.slice(1, -1));
    }
  }

  /** Map local alias -> original name for cosmetic aliases we'll strip */
  const aliasToOriginal = new Map();
  let changed = false;

  // Rewrite import statements (process from end so indices stay valid)
  const replacements = [];
  for (const imp of imports) {
    let specsChanged = false;
    const newSpecs = imp.specs.map((s) => {
      if (s.unparsed || !s.aliased) return s;
      const paths = originalToPaths.get(s.original);
      if (paths && paths.size > 1) {
        // Real cross-module collision: keep alias
        return s;
      }
      // Cosmetic (or same-module duplicate): strip alias
      aliasToOriginal.set(s.local, s.original);
      specsChanged = true;
      return { ...s, local: s.original, aliased: false };
    });

    if (!specsChanged) continue;

    // Deduplicate specs after stripping (same original twice from same import)
    const seen = new Set();
    const deduped = [];
    for (const s of newSpecs) {
      if (s.unparsed) {
        deduped.push(s);
        continue;
      }
      const key = `${s.typePrefix}:${s.original}:${s.aliased ? s.local : ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(s);
    }

    const typeKw = imp.typeImport ? 'type ' : '';
    const newImport = `import ${typeKw}{ ${formatSpecs(deduped)} } from ${imp.from};`;
    replacements.push({ start: imp.start, end: imp.end, text: newImport });
    changed = true;
  }

  // Also merge duplicate import lines from same path that become identical after strip
  // First apply import replacements
  for (const r of replacements.sort((a, b) => b.start - a.start)) {
    content = content.slice(0, r.start) + r.text + content.slice(r.end);
  }

  // After rewriting, merge duplicate plain imports from the same module path
  if (changed) {
    content = mergeDuplicateImports(content);
  }

  // Replace alias usages in the rest of the file (extends, etc.)
  // Longer aliases first to avoid partial issues
  const aliases = [...aliasToOriginal.entries()].sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [alias, orig] of aliases) {
    if (alias === orig) continue;
    const re = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'g');
    const next = content.replace(re, orig);
    if (next !== content) {
      content = next;
      changed = true;
    }
  }

  if (changed && content !== original) {
    fs.writeFileSync(filePath, content);
    return { changed: true, stripped: aliases.length };
  }
  return { changed: false, stripped: 0 };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mergeDuplicateImports(content) {
  const importRe =
    /^import\s+(type\s+)?\{([^}]*)\}\s+from\s+(['"][^'"]+['"]);?\s*$/gm;

  /** @type {Map<string, { indices: number[], specs: any[], typeImport: boolean, from: string, fulls: string[] }>} */
  const byKey = new Map();
  const matches = [];
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const typeImport = Boolean(m[1]);
    const from = m[3];
    const specs = parseSpecs(m[2]);
    const key = `${typeImport}|${from}`;
    matches.push({
      full: m[0],
      start: m.index,
      end: m.index + m[0].length,
      typeImport,
      from,
      specs,
      key,
    });
  }

  // Group consecutive? Actually merge any same from+typeImport that are all non-aliased / compatible
  const groups = new Map();
  for (const match of matches) {
    // Only merge if none of the specs are aliased (collision imports stay separate)
    const hasAlias = match.specs.some((s) => !s.unparsed && s.aliased);
    if (hasAlias) continue;
    if (!groups.has(match.key)) groups.set(match.key, []);
    groups.get(match.key).push(match);
  }

  const toRemove = [];
  const toReplace = [];

  for (const [, group] of groups) {
    if (group.length < 2) continue;
    // Merge all specs into first import
    const mergedSpecs = [];
    const seen = new Set();
    for (const g of group) {
      for (const s of g.specs) {
        if (s.unparsed) {
          mergedSpecs.push(s);
          continue;
        }
        const k = `${s.typePrefix}:${s.original}`;
        if (seen.has(k)) continue;
        seen.add(k);
        mergedSpecs.push(s);
      }
    }
    const typeKw = group[0].typeImport ? 'type ' : '';
    const newImport = `import ${typeKw}{ ${formatSpecs(mergedSpecs)} } from ${group[0].from};`;
    toReplace.push({ start: group[0].start, end: group[0].end, text: newImport });
    for (let i = 1; i < group.length; i++) {
      toRemove.push({ start: group[i].start, end: group[i].end });
    }
  }

  // Apply from end
  const ops = [
    ...toReplace.map((r) => ({ ...r, kind: 'replace' })),
    ...toRemove.map((r) => ({ ...r, text: '', kind: 'remove' })),
  ].sort((a, b) => b.start - a.start);

  for (const op of ops) {
    let { start, end, text } = op;
    // When removing, also eat following newline if present
    if (op.kind === 'remove' && content[end] === '\n') end += 1;
    content = content.slice(0, start) + text + content.slice(end);
  }

  return content;
}

const files = walk(ROOT);
let changedFiles = 0;
let totalStripped = 0;
const report = [];

for (const f of files) {
  const result = processFile(f);
  if (result.changed) {
    changedFiles++;
    totalStripped += result.stripped;
    report.push(`${path.relative(process.cwd(), f)} (${result.stripped} aliases)`);
  }
}

console.log(`Changed ${changedFiles} files, stripped ~${totalStripped} cosmetic aliases`);
for (const line of report) console.log('  ', line);
