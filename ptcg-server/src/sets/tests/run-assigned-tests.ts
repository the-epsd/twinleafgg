import { spawnSync } from 'child_process';
import {
  getAssignableCards,
  getAssignedSpecPaths,
  getAssignedTests,
  searchReusableCardTests,
  validateTestCatalog
} from './test-catalog';

interface ParsedArgs {
  card?: string;
  search?: string;
  tag?: string;
  listCards: boolean;
  dryRun: boolean;
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = { listCards: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--card') {
      parsed.card = argv[i + 1];
      i++;
    } else if (arg === '--search') {
      parsed.search = argv[i + 1];
      i++;
    } else if (arg === '--tag') {
      parsed.tag = argv[i + 1];
      i++;
    } else if (arg === '--list-cards') {
      parsed.listCards = true;
    } else if (arg === '--dry-run') {
      parsed.dryRun = true;
    }
  }
  return parsed;
}

function printUsage(): void {
  console.log('Usage: ts-node src/sets/tests/run-assigned-tests.ts [--card "Card FullName"] [--search "text"] [--tag "tag"] [--list-cards] [--dry-run]');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const validation = validateTestCatalog();
  if (validation.missingTestIds.length > 0) {
    throw new Error(`[test-catalog] Invalid catalog. Missing test IDs: ${validation.missingTestIds.join(', ')}`);
  }

  if (args.listCards) {
    console.log(getAssignableCards().join('\n'));
    return;
  }

  if (args.search || args.tag) {
    const tags = args.tag ? [args.tag] : [];
    const matches = searchReusableCardTests({
      text: args.search,
      tags
    });
    console.log(JSON.stringify(matches, null, 2));
    return;
  }

  if (!args.card) {
    printUsage();
    return;
  }

  const assignedTests = getAssignedTests(args.card);
  if (assignedTests.length === 0) {
    throw new Error(`[test-catalog] No tests assigned to card "${args.card}"`);
  }

  const specPaths = getAssignedSpecPaths(args.card);
  console.log(`[test-catalog] ${args.card}: ${assignedTests.length} tests across ${specPaths.length} spec files.`);
  specPaths.forEach(path => console.log(` - ${path}`));

  if (args.dryRun) {
    return;
  }

  const result = spawnSync('npx', ['jasmine-ts', ...specPaths], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
}

main();
