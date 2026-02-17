import { validateTestCatalog, getAssignedTests } from './test-catalog';

describe('Card Test Catalog', () => {
  it('should not contain missing test IDs in assignments', () => {
    const validation = validateTestCatalog();
    expect(validation.missingTestIds).toEqual([]);
  });

  it('should return assigned tests for known cards', () => {
    const assigned = getAssignedTests('Manaphy BRS');
    expect(assigned.length).toBeGreaterThan(0);
  });
});
