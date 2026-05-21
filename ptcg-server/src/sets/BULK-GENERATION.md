# Bulk Card Generation Guide

This guide documents the process for automatically generating entire Pokemon TCG sets using Claude Code. It complements the main `CLAUDE.md` which contains prefab references and card templates.

## Overview

The bulk generation process uses:
1. **card-data.json** - JSON file containing all cards in a set from Pokemon TCG API
2. **Tier-based implementation** - Cards grouped by complexity for efficient batch processing
3. **Pattern matching** - Attack text mapped to existing prefab functions
4. **Existing examples** - Similar cards in the codebase used as templates

---

## Step 1: Obtain card-data.json

### Using Pokemon TCG API

The card-data.json files use the [Pokemon TCG API](https://pokemontcg.io/) format. Fetch set data using:

```bash
# Replace SET_ID with the set code (e.g., bw2 for Emerging Powers)
# API key should be in .env as POKEMON_TCG_IO_API
curl "https://api.pokemontcg.io/v2/cards?q=set.id:SET_ID" \
  -H "X-Api-Key: $POKEMON_TCG_IO_API" \
  | jq '.data' > card-data.json
```

### Set ID Reference

| Era | Set Name | Set ID |
|-----|----------|--------|
| **Black & White** | Black & White | bw1 |
| | Emerging Powers | bw2 |
| | Noble Victories | bw3 |
| | Next Destinies | bw4 |
| | Dark Explorers | bw5 |
| | Dragons Exalted | bw6 |
| | Boundaries Crossed | bw7 |
| | Plasma Storm | bw8 |
| | Plasma Freeze | bw9 |
| | Plasma Blast | bw10 |
| | Legendary Treasures | bw11 |
| **XY** | XY Base | xy1 |
| | Flashfire | xy2 |
| | Furious Fists | xy3 |
| | Phantom Forces | xy4 |
| | Primal Clash | xy5 |
| **Sun & Moon** | Sun & Moon | sm1 |
| | Guardians Rising | sm2 |
| | Burning Shadows | sm3 |
| **Sword & Shield** | Sword & Shield | swsh1 |
| | Rebel Clash | swsh2 |
| | Darkness Ablaze | swsh3 |
| **Scarlet & Violet** | Scarlet & Violet | sv1 |
| | Paldea Evolved | sv2 |
| | Obsidian Flames | sv3 |

### Using the Fetch Script

```bash
# From repository root
./fetch-set-cards.sh bw2
# Creates ptcg-server/src/sets/set-emerging-powers/card-data.json
```

### card-data.json Format

```json
[
  {
    "id": "bw2-1",
    "name": "Pansage",
    "number": "1",
    "supertype": "Pokémon",
    "subtypes": ["Basic"],
    "hp": "70",
    "types": ["Grass"],
    "evolvesFrom": null,
    "attacks": [
      {
        "name": "Collect",
        "cost": ["Colorless"],
        "damage": "",
        "text": "Draw a card."
      },
      {
        "name": "Scratch",
        "cost": ["Colorless", "Colorless"],
        "damage": "20",
        "text": ""
      }
    ],
    "weaknesses": [{ "type": "Fire", "value": "×2" }],
    "resistances": [{ "type": "Water", "value": "-20" }],
    "retreatCost": ["Colorless"],
    "abilities": null
  }
]
```

---

## Step 2: Analyze and Categorize Cards

### Tier-Based Complexity Classification

**Tier 1: No-Effect Cards (~15%)**
Vanilla damage attacks with no text effects. No `reduceEffect` method needed.
- Attack text is empty or just damage
- Example: `{ damage: "20", text: "" }`

**Tier 2: Simple Prefab Cards (~40%)**
Single well-known effect that maps directly to a prefab:
- "Draw a card" → `DRAW_CARDS(player, 1)`
- "Flip a coin. If heads, paralyzed" → `COIN_FLIP_PROMPT` + status prefab
- "Does X damage to itself" → `THIS_POKEMON_DOES_DAMAGE_TO_ITSELF`

**Tier 3: Multi-Prefab Cards (~25%)**
Combining multiple effects:
- "Flip 2 coins. Does 30 damage × heads" → `MULTIPLE_COIN_FLIPS_PROMPT`
- Conditional (if heads A, if tails B)
- Heal + damage combinations

**Tier 4: Complex Effect Cards (~15%)**
Markers, state tracking, complex prompts:
- "Can't attack next turn" → marker pattern
- "Reduce damage next turn" → `DealDamageEffect` interception
- "Search deck for evolution" → `ChooseCardsPrompt` with filters

**Tier 5: Ability Cards (~5%)**
Pokemon with Abilities requiring:
- `WAS_POWER_USED` detection
- Once-per-turn markers
- Passive effect interception

---

## Step 3: Implementation Workflow

### For Each Card:

1. **Read from card-data.json** - Get exact HP, types, attacks, costs, damage
2. **Search for similar effects** - Find existing cards with matching attack text
3. **Select appropriate prefabs** - Reference CLAUDE.md prefab section
4. **Generate implementation** - Use card template with correct properties
5. **Verify properties match** - Double-check HP, weakness, retreat vs JSON

### File Naming Convention

```
{pokemon-name}.ts           # Single card (pansage.ts)
{pokemon-name}-2.ts         # Second card with same name (sewaddle-2.ts)
{pokemon-name}-{setNumber}.ts  # When clarity needed (whimsicott-11.ts)
```

### Class Naming Convention

```typescript
export class Pansage extends PokemonCard { }
export class Sewaddle2 extends PokemonCard { }  // Number suffix for duplicates
```

---

## Step 4: Text Pattern → Code Mapping

### Attack Effects

| Card Text Pattern | Implementation |
|-------------------|----------------|
| `"Draw a card."` | `DRAW_CARDS(player, 1)` |
| `"Draw 2 cards."` | `DRAW_CARDS(player, 2)` |
| `"Flip a coin. If heads, this attack does X more damage."` | `FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, X)` |
| `"Flip a coin. If tails, this attack does nothing."` | `FLIP_A_COIN_IF_TAILS_THIS_ATTACK_DOES_NOTHING(store, state, effect)` |
| `"Flip X coins. This attack does Y damage for each heads."` | `MULTIPLE_COIN_FLIPS_PROMPT` → count heads → `effect.damage = Y * heads` |
| `"The Defending Pokémon is now Paralyzed."` | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect)` |
| `"The Defending Pokémon is now Asleep."` | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect)` |
| `"The Defending Pokémon is now Confused."` | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect)` |
| `"The Defending Pokémon is now Poisoned."` | `ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 10)` |
| `"The Defending Pokémon is now Burned."` | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect)` |
| `"This Pokémon does X damage to itself."` | `THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, X)` |
| `"Heal X damage from this Pokémon."` | `HEAL_X_DAMAGE_FROM_THIS_POKEMON(X, effect, store, state)` |
| `"Discard an Energy attached to the Defending Pokémon."` | Filter `EnergyCard` from `opponent.active.cards`, then `moveCardTo(discard)` |
| `"Does X damage to 1 of your opponent's Pokémon."` | `ChoosePokemonPrompt` → `PutDamageEffect` (no weakness for bench) |
| `"Does X damage to each of your opponent's Benched Pokémon."` | Loop `opponent.bench` → `PutDamageEffect` for each |
| `"Switch this Pokémon with 1 of your Benched Pokémon."` | `ChoosePokemonPrompt(BENCH)` → `player.switchPokemon(target)` |

### Damage Modifiers

| Card Text Pattern | Implementation |
|-------------------|----------------|
| `"Does X more damage for each [condition]."` | Count condition, then `effect.damage += X * count` |
| `"Does X more damage for each Energy attached to this Pokémon."` | `player.active.cards.filter(EnergyCard).length * X` |
| `"Does X more damage for each damage counter on this Pokémon."` | `player.active.damage / 10 * X` |
| `"If the Defending Pokémon already has damage counters, +X."` | `if (opponent.active.damage > 0) effect.damage += X` |

### Self-Lock Patterns

| Card Text Pattern | Implementation |
|-------------------|----------------|
| `"This Pokémon can't attack during your next turn."` | `player.active.cannotAttackNextTurnPending = true` |
| `"This Pokémon can't use [Attack] during your next turn."` | Marker + check on `AttackEffect` |
| `"The Defending Pokémon can't attack during your opponent's next turn."` | Marker on opponent.active + throw `GameError` |
| `"The Defending Pokémon can't retreat during your opponent's next turn."` | Marker + intercept `RetreatEffect` |

### Damage Reduction Patterns

| Card Text Pattern | Implementation |
|-------------------|----------------|
| `"During your opponent's next turn, damage is reduced by X."` | Marker + intercept `DealDamageEffect`: `effect.damage = Math.max(0, effect.damage - X)` |
| `"Prevent all effects of attacks, including damage."` | Marker + intercept `AbstractAttackEffect`: `effect.preventDefault = true` |
| `"If damage would be X or less, prevent that damage."` | Marker + `if (effect.damage <= X) effect.damage = 0` |

---

## Step 5: Common Gotchas and Fixes

### Import Errors

**Wrong module for PlayerType/SlotType:**
```typescript
// WRONG - These are not in card-types
import { PlayerType, SlotType } from '../../game/store/card/card-types';

// CORRECT - Import from game
import { PlayerType, SlotType } from '../../game';
```

**Wrong path for DISCARD_X_ENERGY_FROM_THIS_POKEMON:**
```typescript
// WRONG
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/prefabs';

// CORRECT
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
```

### Prompt Usage

**ChooseCardsPrompt filtering:**
```typescript
// WRONG - filter function doesn't exist
new ChooseCardsPrompt(player, message, source, { filter: fn })

// CORRECT - use blocked array of indices
const blocked: number[] = [];
source.cards.forEach((c, i) => {
  if (!matchesFilter(c)) blocked.push(i);
});
new ChooseCardsPrompt(player, message, source, {}, { blocked })
```

**ChooseAttackPrompt expects array:**
```typescript
// WRONG
new ChooseAttackPrompt(player.id, message, pokemonCard, options)

// CORRECT - wrap in array
new ChooseAttackPrompt(player.id, message, [pokemonCard], options)
```

**CheckProvidedEnergyEffect needs target:**
```typescript
// WRONG - only takes player
const check = new CheckProvidedEnergyEffect(player);

// CORRECT - specify target Pokemon
const check = new CheckProvidedEnergyEffect(player, player.active);
store.reduceEffect(state, check);
check.energyMap.forEach(em => {
  // em.provides is array of CardType
});
```

### Energy Detection

**Checking for energy type:**
```typescript
// WRONG - comparing superType to string
card.superType === 'ENERGY'

// CORRECT - use instanceof
card instanceof EnergyCard
```

### Marker Management

**Using marker prefabs vs direct access:**
```typescript
// Prefabs (ADD_MARKER, HAS_MARKER, etc.) are available but often unused
// Direct marker access is more common in the codebase:
player.active.marker.addMarker(this.MARKER_NAME, this);
player.active.marker.hasMarker(this.MARKER_NAME, this);
player.active.marker.removeMarker(this.MARKER_NAME, this);

// Clean up on EndTurnEffect (clear opponent's markers from your turn)
if (effect instanceof EndTurnEffect) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.active.marker.removeMarker(this.MARKER_NAME, this);
}
```

### Recursive Functions Need Return Types

```typescript
// WRONG - TS7023 error
const flipUntilTails = () => {
  return store.prompt(state, new CoinFlipPrompt(...), result => {
    if (result) return flipUntilTails();  // Recursive
    // ...
  });
};

// CORRECT - explicit return type
const flipUntilTails = (): State => {
  return store.prompt(state, new CoinFlipPrompt(...), result => {
    if (result) return flipUntilTails();
    // ...
  });
};
```

### OrderCardsPrompt Pattern

```typescript
// For "look at top X cards and put back in any order"
const deckTop = new CardList();
opponent.deck.moveTo(deckTop, 5);  // Move top 5 to temp list

return store.prompt(state, new OrderCardsPrompt(
  player.id,
  GameMessage.CHOOSE_CARDS_ORDER,
  deckTop,
  { allowCancel: false }
), order => {
  if (order) {
    deckTop.applyOrder(order);
    deckTop.moveToTopOfDestination(opponent.deck);
  }
});
```

---

## Step 6: Verification Checklist

After implementing all cards:

1. **TypeScript compiles** - Run `npm run compile` with no errors
2. **No unused imports** - Fix all TS6133 warnings
3. **Properties match JSON** - HP, weakness, retreat, attack costs/damage
4. **fullName unique** - Format: `"CardName SET"` or `"CardName SET ##"` for duplicates
5. **setNumber correct** - Matches card-data.json number field
6. **evolvesFrom set** - For all Stage 1/2 Pokemon
7. **index.ts updated** - All cards exported in set's index.ts

---

## Step 7: Batch Processing Strategy

When implementing a full set:

### Phase 1: No-Effect Cards
Create all vanilla cards first (no `reduceEffect` needed).
These are quick wins that establish the file structure.

### Phase 2: Simple Prefabs (Grouped by Effect)
Process cards with similar effects together:
- All "Draw a card" cards
- All "Flip for paralysis" cards
- All "Self damage" cards

### Phase 3: Multi-Prefab Cards
Implement cards requiring multiple effects.
Search codebase for similar attack text patterns.

### Phase 4: Complex Cards
Handle marker-based effects, damage reduction, attack blocking.
Reference similar cards in other sets.

### Phase 5: Ability Cards
Implement Pokemon with Abilities last.
These require the most complex logic.

### Phase 6: Index & Cleanup
- Add all exports to index.ts
- Run compile, fix any errors
- Remove unused imports

---

## Example: Emerging Powers Implementation

The Emerging Powers set (EPO/bw2) was implemented using this process:

**Stats:**
- Total cards: 98 (97 Pokemon + 1 already done)
- Tier 1 (no-effect): ~12 cards
- Tier 2 (simple): ~35 cards
- Tier 3 (multi): ~25 cards
- Tier 4 (complex): ~12 cards
- Tier 5 (ability): 1 card (Krookodile #62)

**Time to implement:** ~2-3 hours with Claude Code

**Key patterns used:**
- Marker-based damage reduction (Cotton Guard, Reflect)
- Opponent can't attack markers (Sheer Cold, Scarf Hold)
- Self-lock attacks (Sacred Sword pattern on Virizion/Terrakion/Cobalion)
- Flip until tails (Mandibuzz's Bone Rush)
- Search and evolve (Leavanny's Nurturing)

---

## Reference Files

- **CLAUDE.md** - Prefab reference, card templates, effect types
- **generate-card-from-tcgdex.ts** - Single card generation from TCGdex
- **fetch-set-cards.sh** - Bulk card data fetching script
- **set-emerging-powers/** - Reference implementation of a complete set

---

## Quick Start Checklist

- [ ] Obtain card-data.json for target set
- [ ] Create set directory: `set-{set-name}/`
- [ ] Place card-data.json in set directory
- [ ] Analyze cards, categorize by tier
- [ ] Implement Tier 1 (no-effect) cards
- [ ] Implement Tier 2-4 (effects) cards
- [ ] Implement Tier 5 (abilities) cards
- [ ] Create index.ts with all exports
- [ ] Run `npm run compile`, fix errors
- [ ] Clean up unused imports
- [ ] Verify all properties match card-data.json
