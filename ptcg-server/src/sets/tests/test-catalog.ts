export interface ReusableCardTestDefinition {
  id: string;
  title: string;
  description: string;
  specPath: string;
  tags: string[];
  promptTypes: string[];
}

export interface CardTestAssignmentRecord {
  tests: string[];
  notes?: string;
}

export interface SearchCardTestsOptions {
  text?: string;
  tags?: string[];
}

export const REUSABLE_CARD_TESTS: ReusableCardTestDefinition[] = [
  {
    id: 'manaphy.wave-veil.prevent-bench-damage',
    title: 'Wave Veil prevents bench damage',
    description: 'Bench-targeted damage is blocked while Manaphy is in play.',
    specPath: 'src/sets/tests/manaphy.spec.ts',
    tags: ['ability', 'bench-protection', 'damage-prevention', 'passive'],
    promptTypes: []
  },
  {
    id: 'manaphy.wave-veil.does-not-protect-active',
    title: 'Wave Veil does not prevent active damage',
    description: 'Damage to the active Pokemon is not blocked by Wave Veil.',
    specPath: 'src/sets/tests/manaphy.spec.ts',
    tags: ['ability', 'bench-protection', 'active-damage-control', 'passive'],
    promptTypes: []
  },
  {
    id: 'manaphy.wave-veil.control-no-manaphy',
    title: 'Bench damage without Manaphy is not blocked',
    description: 'Control scenario for bench damage behavior when source ability is absent.',
    specPath: 'src/sets/tests/manaphy.spec.ts',
    tags: ['ability', 'bench-protection', 'control'],
    promptTypes: []
  },
  {
    id: 'eelektrik.dynamotor.attach-from-discard',
    title: 'Dynamotor attaches Lightning energy from discard',
    description: 'Activated ability attaches one Lightning energy from discard to benched Pokemon.',
    specPath: 'src/sets/tests/eelektrik.spec.ts',
    tags: ['ability', 'activated-ability', 'energy-attachment', 'discard'],
    promptTypes: ['Attach energy']
  },
  {
    id: 'eelektrik.dynamotor.once-per-turn',
    title: 'Dynamotor once-per-turn lock',
    description: 'Second use in the same turn throws and is rejected.',
    specPath: 'src/sets/tests/eelektrik.spec.ts',
    tags: ['ability', 'activated-ability', 'once-per-turn', 'restriction'],
    promptTypes: ['Attach energy']
  },
  {
    id: 'electric-generator.attach-lightning-from-top-five',
    title: 'Electric Generator attaches from top deck cards',
    description: 'Trainer attaches Lightning energy from top deck cards to benched Lightning Pokemon.',
    specPath: 'src/sets/tests/electric-generator.spec.ts',
    tags: ['trainer', 'item', 'energy-attachment', 'deck-top'],
    promptTypes: ['Attach energy']
  },
  {
    id: 'electric-generator.requires-lightning-bench-target',
    title: 'Electric Generator requires Lightning bench target',
    description: 'Trainer play is rejected if no legal Lightning bench target exists.',
    specPath: 'src/sets/tests/electric-generator.spec.ts',
    tags: ['trainer', 'item', 'target-validation', 'restriction'],
    promptTypes: ['Attach energy']
  },
  {
    id: 'raichu.ambushing-spark.base-damage',
    title: 'Ambushing Spark base damage',
    description: 'Attack deals base 40 damage if opponent has not used VSTAR power.',
    specPath: 'src/sets/tests/raichu.spec.ts',
    tags: ['attack', 'damage', 'conditional-damage'],
    promptTypes: []
  },
  {
    id: 'raichu.ambushing-spark.vstar-bonus',
    title: 'Ambushing Spark VSTAR bonus damage',
    description: 'Attack gains +100 damage after opponent uses VSTAR power.',
    specPath: 'src/sets/tests/raichu.spec.ts',
    tags: ['attack', 'damage', 'conditional-damage', 'vstar'],
    promptTypes: []
  }
];

export const CARD_TEST_ASSIGNMENTS: Record<string, CardTestAssignmentRecord> = {
  'Manaphy BRS': {
    tests: [
      'manaphy.wave-veil.prevent-bench-damage',
      'manaphy.wave-veil.does-not-protect-active',
      'manaphy.wave-veil.control-no-manaphy'
    ],
    notes: 'Bench damage prevention baseline suite.'
  },
  'Eelektrik NVI': {
    tests: [
      'eelektrik.dynamotor.attach-from-discard',
      'eelektrik.dynamotor.once-per-turn'
    ],
    notes: 'Activated discard-to-bench energy acceleration and once-per-turn lock.'
  },
  'Electric Generator PAF': {
    tests: [
      'electric-generator.attach-lightning-from-top-five',
      'electric-generator.requires-lightning-bench-target'
    ],
    notes: 'Top-deck attachment and legal-target gating.'
  },
  'Raichu SIT': {
    tests: [
      'raichu.ambushing-spark.base-damage',
      'raichu.ambushing-spark.vstar-bonus'
    ],
    notes: 'Conditional damage baseline for VSTAR-state interactions.'
  }
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

export function searchReusableCardTests(options: SearchCardTestsOptions = {}): ReusableCardTestDefinition[] {
  const queryText = options.text ? normalize(options.text) : '';
  const queryTags = (options.tags ?? []).map(normalize);

  return REUSABLE_CARD_TESTS.filter(test => {
    if (queryText) {
      const haystack = `${test.id} ${test.title} ${test.description} ${test.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(queryText)) {
        return false;
      }
    }

    if (queryTags.length > 0) {
      const testTags = test.tags.map(normalize);
      if (!queryTags.every(tag => testTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}

export function getAssignedTestIds(cardFullName: string): string[] {
  return CARD_TEST_ASSIGNMENTS[cardFullName]?.tests ?? [];
}

export function getAssignedTests(cardFullName: string): ReusableCardTestDefinition[] {
  const assignedIds = new Set(getAssignedTestIds(cardFullName));
  return REUSABLE_CARD_TESTS.filter(test => assignedIds.has(test.id));
}

export function getAssignedSpecPaths(cardFullName: string): string[] {
  const paths = getAssignedTests(cardFullName).map(test => test.specPath);
  return Array.from(new Set(paths));
}

export function getAssignableCards(): string[] {
  return Object.keys(CARD_TEST_ASSIGNMENTS).sort();
}

export function validateTestCatalog(): { missingTestIds: string[] } {
  const testIds = new Set(REUSABLE_CARD_TESTS.map(test => test.id));
  const missing = new Set<string>();

  for (const assignment of Object.values(CARD_TEST_ASSIGNMENTS)) {
    for (const testId of assignment.tests) {
      if (!testIds.has(testId)) {
        missing.add(testId);
      }
    }
  }

  return {
    missingTestIds: Array.from(missing).sort()
  };
}
