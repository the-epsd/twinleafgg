# Card Test Harness Guide

## Quick Start

```typescript
import { setupGame, padDeck } from './test-helpers';
import { useAttack, getDamage } from './card-test-helpers';

describe('My Card Test', () => {
  it('should deal damage', () => {
    const game = setupGame({
      player1: {
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: padDeck(10),
      },
      player2: {
        active: { card: 'Ralts SIT' },
        deck: padDeck(10),
      }
    });

    useAttack(game.store, game.state, 0, 'Ambushing Spark');
    expect(getDamage(game.state, 1, 'active')).toBe(40);
  });
});
```

## Harness Guarantees

- The harness only registers sets needed by cards in the specific scenario config (no global auto-load).
- Prompt auto-resolution now follows production flow: `decode` then `validate`, and throws if invalid.
- Prompt defaults are legal-aware for `ChooseEnergyPrompt`, `AttachEnergyPrompt`, and `DiscardEnergyPrompt`.

## Test Patterns

### 1. Passive Ability (effect-level)

For abilities that modify damage or prevent effects, use the reusable effect factories:

```typescript
import { createDamageEffect, createActiveDamageEffect } from './card-test-helpers';

// Bench damage — targeting defender's bench[0]
const effect = createDamageEffect(game, 1, { benchIndex: 0 });
game.store.reduceEffect(game.state, effect);
expect(effect.preventDefault).toBe(true); // blocked by Manaphy

// Active damage — omit benchIndex to target active
const activeEffect = createActiveDamageEffect(game, 1);
game.store.reduceEffect(game.state, activeEffect);
expect(activeEffect.preventDefault).toBe(false); // not blocked

// Custom damage amount
const bigHit = createDamageEffect(game, 1, { benchIndex: 0, damage: 100 });
```

### 2. Conditional Attack (action-level)

```typescript
game.player2.usedVSTAR = true;
useAttack(game.store, game.state, 0, 'Ambushing Spark');
expect(getDamage(game.state, 1, 'active')).toBe(140); // 40 + 100
```

### 3. Activated Ability

```typescript
useAbility(game.store, game.state, 0, 'Dynamotor');
// Check side effects
expect(getZoneCount(game.state, 0, 'discard')).toBe(0);
expect(getEnergyCount(game.state, 0, 1)).toBe(1);

// Second use should fail
expect(() => useAbility(game.store, game.state, 0, 'Dynamotor')).toThrow();
```

### 4. Trainer Card

```typescript
playTrainerCard(game.store, game.state, 0, 'Electric Generator PAF');
expect(getEnergyCount(game.state, 0, 0)).toBeGreaterThan(0);
```

## Prompt Auto-Resolution

The test harness auto-resolves ALL prompts with sensible defaults:

| Prompt Type | Default Resolution |
|---|---|
| AlertPrompt, ShowCardsPrompt | `true` |
| ConfirmPrompt, ConfirmCardsPrompt | `true` |
| ChooseCardsPrompt | Pick first N valid (non-blocked) cards up to max |
| ChoosePokemonPrompt | Pick first valid target(s) |
| AttachEnergyPrompt | Attach first energy to first valid target |
| ChooseEnergyPrompt | Pick first valid energy maps |
| SelectPrompt, SelectOptionPrompt | Index 0 |
| ChoosePrizePrompt | First N non-empty prizes |
| OrderCardsPrompt | Keep original order |
| PutDamagePrompt | All damage on first valid target |
| MoveDamagePrompt, MoveEnergyPrompt | Cancel if allowed, else empty |
| DiscardEnergyPrompt | Discard first valid energies |
| CoinFlipPrompt | Always heads |
| ShuffleDeckPrompt | No shuffle (preserve order) |

### Overriding Prompts

Override a specific prompt type (one-shot) to control test behavior:

```typescript
game.overridePrompt('Choose pokemon', (prompt, state) => {
  // Return specific targets instead of the default
  return [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 2 }];
});
```

## Common Card fullNames

### Energy
- `'Water Energy SVE'`
- `'Lightning Energy SVE'`
- `'Fire Energy SVE'`
- `'Grass Energy SVE'`
- `'Psychic Energy SVE'`
- `'Fighting Energy SVE'`
- `'Darkness Energy SVE'`
- `'Metal Energy SVE'`

### Filler Pokemon
- `'Ralts SIT'` — Psychic Basic, 60 HP
- `'Manaphy BRS'` — Water Basic, 70 HP

## `padDeck(n, cardName?)`

Returns an array of `n` copies of a filler card (default: `'Water Energy SVE'`).
Use this to fill a player's deck so it doesn't run out during tests:

```typescript
deck: padDeck(10) // 10 Water Energy SVE
deck: ['Lightning Energy SVE', ...padDeck(9)] // 1 Lightning + 9 filler
```

## Running Tests

```bash
cd ptcg-server && npx jasmine-ts "src/sets/tests/*.spec.ts"
```

Run tests assigned to one card:

```bash
cd ptcg-server && npx ts-node src/sets/tests/run-assigned-tests.ts --card "Manaphy BRS"
```

Preview assigned specs without running:

```bash
cd ptcg-server && npx ts-node src/sets/tests/run-assigned-tests.ts --card "Manaphy BRS" --dry-run
```

Search the reusable test database:

```bash
cd ptcg-server && npx ts-node src/sets/tests/run-assigned-tests.ts --search "bench damage"
cd ptcg-server && npx ts-node src/sets/tests/run-assigned-tests.ts --tag "once-per-turn"
```

List cards with explicit assignments:

```bash
cd ptcg-server && npx ts-node src/sets/tests/run-assigned-tests.ts --list-cards
```

Or run the full test suite:

```bash
cd ptcg-server && npm test
```
