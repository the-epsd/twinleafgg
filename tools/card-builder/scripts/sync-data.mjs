#!/usr/bin/env node
/**
 * Syncs https://github.com/PokemonTCG/pokemon-tcg-data into data/pokemon-tcg-data
 * (shallow clone / pull). Run before first `npm run dev`.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data', 'pokemon-tcg-data');
const parent = join(root, 'data');
const repo = 'https://github.com/PokemonTCG/pokemon-tcg-data.git';

function run(cmd, args, cwd) {
  const res = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: false });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}

mkdirSync(parent, { recursive: true });

if (!existsSync(join(dataDir, '.git'))) {
  console.log('Cloning PokemonTCG/pokemon-tcg-data (shallow)…');
  // Full shallow clone — sparse checkout of cards/ is awkward across git versions;
  // the repo is mostly JSON and clones quickly enough for local tooling.
  run('git', ['clone', '--depth', '1', '--single-branch', '--branch', 'master', repo, dataDir], parent);
} else {
  console.log('Updating pokemon-tcg-data…');
  run('git', ['fetch', '--depth', '1', 'origin', 'master'], dataDir);
  run('git', ['reset', '--hard', 'origin/master'], dataDir);
}

console.log('Ready:', dataDir);
console.log('Sets:', join(dataDir, 'sets', 'en.json'));
console.log('Cards:', join(dataDir, 'cards', 'en'));
