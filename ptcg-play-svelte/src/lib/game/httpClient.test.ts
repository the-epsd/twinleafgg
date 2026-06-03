import { describe, expect, it } from 'vitest';
import { hostedAvailableActionsScope } from './httpClient';

describe('hosted headless requests', () => {
  it('skips legality dry-runs for latency-sensitive mutation responses', () => {
    expect(hostedAvailableActionsScope({ type: 'playCard' })).toBe('none');
    expect(hostedAvailableActionsScope({ type: 'resolvePrompt' })).toBe('none');
    expect(hostedAvailableActionsScope({ type: 'attack' })).toBe('none');
    expect(hostedAvailableActionsScope({ type: 'retreat' })).toBe('none');
  });

  it('keeps default active-player legality for initial and explicit state requests', () => {
    expect(hostedAvailableActionsScope({ type: 'newGame' })).toBeUndefined();
    expect(hostedAvailableActionsScope({ type: 'state' })).toBeUndefined();
    expect(hostedAvailableActionsScope({ type: 'passTurn' })).toBeUndefined();
  });

  it('allows callers to opt back into scoped legality', () => {
    expect(hostedAvailableActionsScope({ type: 'playCard', availableActionsScope: 'active' })).toBe('active');
    expect(hostedAvailableActionsScope({ type: 'state', availableActionsScope: 'full' })).toBe('full');
  });
});
