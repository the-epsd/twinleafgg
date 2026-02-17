# Text-to-Code Patterns

Card text from different Pokemon TCG eras uses varying grammar. This reference maps card text patterns to their code implementations.

## Table of Contents
- [Drawing Cards](#drawing-cards)
- [Special Conditions](#special-conditions)
- [Coin Flips](#coin-flips)
- [Damage Effects](#damage-effects)
- [Compound Prefab Patterns (Use First)](#compound-prefab-patterns-use-first)
- [Healing](#healing)
- [Switching Pokemon](#switching-pokemon)
- [Energy Manipulation](#energy-manipulation)
- [Searching Deck](#searching-deck)
- [Discard Pile](#discard-pile)
- [Attack Restrictions](#attack-restrictions)
- [Damage Prevention/Reduction](#damage-preventionreduction)
- [Bench Targeting](#bench-targeting)
- [Trainer Prefabs](#trainer-prefabs)
- [Energy Card Prefabs](#energy-card-prefabs)
- [Grammar Variations by Era](#grammar-variations-by-era)

---

## Drawing Cards

| Card Text | Code |
|-----------|------|
| "Draw a card." | `DRAW_CARDS(player, 1)` |
| "Draw 2 cards." | `DRAW_CARDS(player, 2)` |
| "Draw 3 cards." | `DRAW_CARDS(player, 3)` |
| "Draw cards until you have X cards in your hand." | `DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, X)` |
| "You may draw up to X cards." | `DRAW_UP_TO_X_CARDS(store, state, player, X)` |
| "Draw until you have 7 cards in your hand." (attack) | `DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(7, effect, state)` |

**Import:** `from '../../game/store/prefabs/prefabs'`

---

## Special Conditions

### Applying to Opponent's Active

| Card Text | Code |
|-----------|------|
| "The Defending Pokemon is now Paralyzed." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect)` |
| "The Defending Pokemon is now Asleep." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect)` |
| "The Defending Pokemon is now Confused." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect)` |
| "The Defending Pokemon is now Poisoned." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect)` |
| "The Defending Pokemon is now Burned." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect)` |

**Modern text variations (same code):**
- "Your opponent's Active Pokemon is now Paralyzed."
- "The Active Pokemon is now Asleep."

**Import:** `from '../../game/store/prefabs/attack-effects'`

### Applying to Your Own Pokemon (abilities, self-effects)

| Card Text | Code |
|-----------|------|
| "This Pokemon is now Asleep." | `ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this)` |
| "This Pokemon is now Poisoned." | `ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this)` |

**Import:** `from '../../game/store/prefabs/prefabs'`

> **IMPORTANT: Attack vs Ability sourcing.** The `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_*` prefabs dispatch `AddSpecialConditionsEffect` (attack-sourced). The `ADD_SLEEP_TO_PLAYER_ACTIVE` / `ADD_POISON_TO_PLAYER_ACTIVE` prefabs dispatch `AddSpecialConditionsPowerEffect` (ability-sourced). **Always use the attack-sourced version (`YOUR_OPPPONENTS_*`) inside attack effects**, even for GX attacks. Only use the ability-sourced version (`ADD_*_TO_PLAYER_ACTIVE`) for ability effects. Some cards intercept these differently.

### Custom Poison/Burn Damage

```typescript
// Poison that does 20 damage instead of 10
ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this, 20);

// Set on the target directly
opponent.active.poisonDamage = 20;
opponent.active.burnDamage = 40;
```

---

## Coin Flips

| Card Text | Code |
|-----------|------|
| "Flip a coin. If heads, this attack does X more damage." | `FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, X)` |
| "Flip a coin. If tails, this attack does nothing." | **No prefab exists.** Use manual pattern: `COIN_FLIP_PROMPT(store, state, player, result => { if (!result) { effect.damage = 0; } });` |
| "Flip a coin. If heads, [effect]." | See pattern below |
| "Flip X coins. This attack does Y damage for each heads." | See pattern below |
| "Flip a coin until you get tails. This attack does X damage times/for each heads." | `FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, X)` |
| "Flip a coin until you get tails. This attack does X more damage for each heads." | `FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, X)` |

### Single Coin Flip with Callback

```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  COIN_FLIP_PROMPT(store, state, player, result => {
    if (result) {
      // Heads - do something
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
    }
  });
}
```

### Multiple Coin Flips

```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
    const heads = results.filter(r => r).length;
    effect.damage = 30 * heads;
  });
}
```

### Flip Until Tails

**Use the prefab** — no manual recursion needed:

```typescript
// "does X damage times the number of heads" (overrides base damage)
return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 30);
```

```typescript
// "does X more damage for each heads" (adds to base damage)
return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, 50);
```

**Import:** `from '../../game/store/prefabs/prefabs'` (COIN_FLIP_PROMPT, MULTIPLE_COIN_FLIPS_PROMPT)
**Import:** `from '../../game/store/prefabs/attack-effects'` (FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE)

---

## Damage Effects

| Card Text | Code |
|-----------|------|
| "This Pokemon does X damage to itself." | `THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, X)` |
| "This attack does X more damage." | `effect.damage += X` |
| "This attack does X less damage." | `effect.damage -= X` |
| "This attack does X more damage for each [condition]." | Count condition, then `effect.damage += X * count` |
| "This attack does X damage for each Energy attached." | `effect.damage = X * player.active.cards.filter(c => c instanceof EnergyCard).length` |
| "This attack does X damage for each damage counter on this Pokemon." | `effect.damage = X * (player.active.damage / 10)` |

### Damage to Opponent's Bench (ignores weakness/resistance)

```typescript
// Single target
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);

// All benched Pokemon
opponent.bench.forEach(benched => {
  if (benched.cards.length > 0) {
    const damage = new PutDamageEffect(effect, 20);
    damage.target = benched;
    store.reduceEffect(state, damage);
  }
});
```

### Damage Counters (not "damage")

**CRITICAL DISTINCTION:** "Put X damage counters" and "does X damage" are DIFFERENT mechanics:
- **"does X damage to 1 of your opponent's Pokemon"** → Uses `THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON` (applies W/R for active via `DealDamageEffect`, bypasses for bench via `PutDamageEffect`)
- **"Put X damage counters on 1 of your opponent's Pokemon"** → Use manual `PutCountersEffect` pattern below (bypasses W/R for ALL targets including active)

```typescript
// Put X damage counters = X * 10 damage
PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(3, store, state, effect);  // 30 damage

// Distribute damage counters
PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(5, store, state, effect);  // 50 damage total

// Put X damage counters on 1 of your opponent's Pokemon (choosing any, including active)
// Reference: set-triumphant/gastly.ts (Sneaky Placement)
store.prompt(state, new ChoosePokemonPrompt(
  player.id, GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
  PlayerType.TOP_PLAYER, [SlotType.ACTIVE, SlotType.BENCH],
  { min: 1, max: 1, allowCancel: false }
), selected => {
  const damageEffect = new PutCountersEffect(effect, 10);  // 1 damage counter = 10
  damageEffect.target = selected[0];
  store.reduceEffect(state, damageEffect);
});
```

**Import:** `from '../../game/store/prefabs/attack-effects'`

---

## Compound Prefab Patterns (Use First)

Use these before writing custom marker/prompt logic.

| Card Text Pattern | Preferred Code | Notes |
|-----------|------|------|
| "During your next turn, this Pokemon's [Attack] attack does X more damage." | `NEXT_TURN_ATTACK_BONUS(effect, { attack: this.attacks[i], source: this, bonusDamage: X, bonusMarker: '...', clearMarker: '...' })` | For named-attack, one-turn-later self-buffs. |
| "During your next turn, this Pokemon's [Attack] attack's base damage is N." | `NEXT_TURN_ATTACK_BASE_DAMAGE(effect, { setupAttack: this.attacks[i], boostedAttack: this.attacks[j], source: this, baseDamage: N, bonusMarker: '...', clearMarker: '...' })` | Use `setupAttack===boostedAttack` when the same attack sets and receives the next-turn base-damage override. |
| "Choose 1 of your Benched Pokemon's attacks and use it as this attack." | `COPY_BENCH_ATTACK(store, state, effect, options?)` | Optionally wrap in `COIN_FLIP_PROMPT` when coin-gated. |
| "If this card is attached to [condition], each of its attacks does X more damage to the Active Pokemon..." | `TOOL_ACTIVE_DAMAGE_BONUS(store, state, effect, this, { damageBonus: X, ...condition })` | Tool cards only. Works on `DealDamageEffect`. |
| "If this card is attached to [condition], its maximum HP is N." | `TOOL_SET_HP_IF(store, state, effect, this, { hp: N, ...condition })` | Tool cards only. Works on `CheckHpEffect`. |
| "If this Pokemon has full HP and would be Knocked Out by damage from an attack, it is not Knocked Out and its remaining HP becomes 10." | `SURVIVE_ON_TEN_IF_FULL_HP(store, state, effect, { source: this, reason: this.powers[0].name })` | Ability-style Sturdy effects. Tool sources also supported. |
| "Devolve the Defending Pokemon and put the highest Stage Evolution card on it into your opponent's [hand/deck/discard/Lost Zone]." | `DEVOLVE_DEFENDING_AFTER_ATTACK(store, state, effect, attackIndex, this, 'hand')` | Handles AFTER_ATTACK timing + destination. |

**Import:** `from '../../game/store/prefabs/prefabs'`

**Condition keys for Tool prefabs:**
- `sourcePokemonName`
- `sourceCardType`
- `sourceCardTag`

---

## Healing

| Card Text | Code |
|-----------|------|
| "Heal X damage from this Pokemon." | `HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, X)` |
| "Heal all damage from this Pokemon." | `player.active.damage = 0` |
| "Remove all Special Conditions from this Pokemon." | `player.active.specialConditions = []` |

**Import:** `from '../../game/store/prefabs/attack-effects'`

---

## Switching Pokemon

| Card Text | Code |
|-----------|------|
| "Switch this Pokemon with 1 of your Benched Pokemon." | `SWITCH_ACTIVE_WITH_BENCHED(store, state, player)` |
| "Your opponent switches their Active Pokemon..." | `SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent)` (opponent chooses) |
| "Switch 1 of your opponent's Benched Pokemon with their Active Pokemon." | `GUST_OPPONENT_BENCHED_POKEMON(store, state, player)` (you choose) |
| "Switch the Defending Pokemon with 1 of your opponent's Benched Pokemon." | Use AfterAttackEffect pattern (see below) |

> **WARNING**: `SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent)` lets the **opponent** choose which benched Pokemon to switch in. For effects where the **attacker** chooses which of the opponent's benched Pokemon comes in (gust effects), use `GUST_OPPONENT_BENCHED_POKEMON(store, state, player)` instead. Reference: `set-ancient-origins/malamar.ts` (Entangling Control).

### Post-Damage Switching (CRITICAL - use AfterAttackEffect)

```typescript
public usedSwitchAttack = false;

if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedSwitchAttack = true;
}

if (effect instanceof AfterAttackEffect && this.usedSwitchAttack) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  if (opponent.bench.some(b => b.cards.length > 0)) {
    SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
  }
}

if (effect instanceof EndTurnEffect) {
  this.usedSwitchAttack = false;
}
```

**Import:** `from '../../game/store/prefabs/prefabs'`

---

## Energy Manipulation

### Discarding Energy from This Pokemon

| Card Text | Code |
|-----------|------|
| "Discard an Energy attached to this Pokemon." | `DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1)` |
| "Discard 2 [R] Energy attached to this Pokemon." | `DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE)` |
| "Discard all Energy attached to this Pokemon." | `DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, player.active.getPokemonCard())` |
| "Discard all [L] Energy attached to this Pokemon." | Manual pattern (see below) |

**Import:** `from '../../game/store/prefabs/costs'` (DISCARD_X_ENERGY_FROM_THIS_POKEMON)
**Import:** `from '../../game/store/prefabs/prefabs'` (DISCARD_ALL_ENERGY_FROM_POKEMON)

> **WARNING**: `DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON` defaults to `minAmount: 0`, making the discard optional. Do NOT use it for mandatory "Discard all [type] Energy" effects. Use the manual pattern:
> ```typescript
> const cards = player.active.cards.filter(c => c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING));
> cards.forEach(c => { player.active.moveCardTo(c, player.discard); });
> ```
> Reference: `set-primal-clash/manectric.ts`

### Discarding Energy from Opponent's Pokemon

| Card Text | Code |
|-----------|------|
| "Discard an Energy attached to the Defending Pokemon." | `DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect)` |
| "Flip a coin. If heads, discard an Energy attached to the Defending Pokemon." | `COIN_FLIP_PROMPT(store, state, effect.player, result => { if (result) { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect); } })` |

**Import:** `from '../../game/store/prefabs/attack-effects'`

> **WARNING**: Do NOT use `moveCardTo(energyCards[0], opponent.discard)` directly! This skips player choice (when multiple energies are attached) and bypasses `DiscardCardsEffect` (preventing effects like Energy Retrieval from intercepting). Always use the prefab.

### Attaching Energy

```typescript
// From discard to bench (prompt user to choose)
ATTACH_ENERGY_PROMPT(store, state, player, PlayerType.BOTTOM_PLAYER, player.discard,
  [SlotType.BENCH], { energyType: EnergyType.BASIC }, { min: 0, max: 1 });

// Move specific energy card
player.discard.moveCardTo(energyCard, target);
```

---

## Searching Deck

| Card Text | Code |
|-----------|------|
| "Search your deck for a Pokemon and put it into your hand." | `SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player)` |
| "Search your deck for a Basic Pokemon and put it onto your Bench." | `SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC })` |
| "Search your deck for up to 2 Basic [L] Pokemon..." | `SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC, cardType: CardType.LIGHTNING }, { max: 2 })` |

### Generic Card Search

```typescript
SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
  { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
  { min: 0, max: 1 }
);
```

### Always Shuffle After Searching

```typescript
// Many search prefabs shuffle automatically
// If doing manual search, always call:
SHUFFLE_DECK(store, state, player);
```

---

## Discard Pile

| Card Text | Code |
|-----------|------|
| "Put a Pokemon from your discard pile into your hand." | `SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, this, { superType: SuperType.POKEMON }, { min: 0, max: 1 })` |

**Import:** `from '../../game/store/prefabs/prefabs'`

---

## Attack Restrictions

### Self-Restriction (this Pokemon can't attack/use move)

| Card Text | Code |
|-----------|------|
| "This Pokemon can't attack during your next turn." | `player.active.cannotAttackNextTurnPending = true` |
| "This Pokemon can't use [Attack Name] during your next turn." | `player.active.cannotUseAttacksNextTurnPending.push('Attack Name')` |

**No cleanup needed** - system handles these automatically.

### Opponent Restriction (Defending Pokemon can't attack)

```typescript
public readonly CANT_ATTACK_MARKER = 'CANT_ATTACK_MARKER';

// On attack
if (WAS_ATTACK_USED(effect, 0, this)) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.active.marker.addMarker(this.CANT_ATTACK_MARKER, this);
}

// Block attacks
if (effect instanceof AttackEffect) {
  if (effect.player.active.marker.hasMarker(this.CANT_ATTACK_MARKER, this)) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }
}

// Cleanup at end of opponent's turn
if (effect instanceof EndTurnEffect) {
  effect.player.active.marker.removeMarker(this.CANT_ATTACK_MARKER, this);
}
```

### Retreat Restriction

| Card Text | Code |
|-----------|------|
| "The Defending Pokemon can't retreat during your opponent's next turn." | `BLOCK_RETREAT(store, state, effect, this)` |

### Activated Ability Limit ("Once during your turn")

```typescript
public readonly MY_ABILITY_MARKER = 'MY_ABILITY_MARKER';

if (WAS_POWER_USED(effect, 0, this)) {
  const player = effect.player;

  // Card-specific validation first...
  USE_ABILITY_ONCE_PER_TURN(player, this.MY_ABILITY_MARKER, this);
  ABILITY_USED(player, this);
  // Ability effect...
}

REMOVE_MARKER_AT_END_OF_TURN(effect, this.MY_ABILITY_MARKER, this);
```

---

## Damage Prevention/Reduction

### During Opponent's Next Turn

Use a CLEAR marker on the opponent's player marker to ensure cleanup fires only at the end of the opponent's turn (not your own):

```typescript
public readonly REDUCE_DAMAGE_MARKER = 'REDUCE_DAMAGE_MARKER';
public readonly CLEAR_REDUCE_DAMAGE_MARKER = 'CLEAR_REDUCE_DAMAGE_MARKER';

// On attack - set marker on this Pokemon + clear marker on opponent
if (WAS_ATTACK_USED(effect, 0, this)) {
  const opponent = StateUtils.getOpponent(state, player);
  player.active.marker.addMarker(this.REDUCE_DAMAGE_MARKER, this);
  opponent.marker.addMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
}

// Intercept damage
if (effect instanceof DealDamageEffect) {
  if (effect.target.marker.hasMarker(this.REDUCE_DAMAGE_MARKER, this)) {
    effect.damage = Math.max(0, effect.damage - 30);
  }
}

// Cleanup at end of opponent's turn only
if (effect instanceof EndTurnEffect
  && effect.player.marker.hasMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this)) {
  effect.player.marker.removeMarker(this.CLEAR_REDUCE_DAMAGE_MARKER, this);
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
    cardList.marker.removeMarker(this.REDUCE_DAMAGE_MARKER, this);
  });
}
```

> **WARNING**: Without the CLEAR marker pattern, the effect marker gets cleaned up at the end of YOUR turn (before the opponent even attacks), making the protection useless. Always use the 2-marker pattern for "during your opponent's next turn" effects. Reference: `set-steam-siege/seedot.ts`

### Prevent All Damage

```typescript
// Use prefab for "prevent all damage" markers
PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, this.PREVENT_MARKER, this);
```

---

## Bench Targeting

### Choose 1 of Opponent's Pokemon

```typescript
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
```

> **WARNING**: `THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON` uses `DealDamageEffect` for the active (applies Weakness/Resistance). If the card text says "not affected by Weakness or Resistance", use `PutDamageEffect` for ALL targets instead:

```typescript
// "This attack does 50 damage to 1 of your opponent's Pokemon.
//  This attack's damage isn't affected by Weakness or Resistance."
const targets = [...opponent.bench.filter(b => b.cards.length > 0), opponent.active];
store.prompt(state, new ChoosePokemonPrompt(
  player.id, GameMessage.CHOOSE_POKEMON, PlayerType.TOP_PLAYER,
  [SlotType.ACTIVE, SlotType.BENCH], { min: 1, max: 1, allowCancel: false }
), selected => {
  const target = selected[0];
  const damage = new PutDamageEffect(effect, 50);
  damage.target = target;
  store.reduceEffect(state, damage);
});
```

Reference: `set-ancient-origins/gardevoir.ts` (Telekinesis), `set-emerging-powers/sigilyph.ts` (Telekinesis)

### Choose 1 of Opponent's Benched Pokemon

```typescript
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(20, effect, store, state);
```

### Damage Each Benched Pokemon

```typescript
opponent.bench.forEach(benched => {
  if (benched.cards.length > 0) {
    const damage = new PutDamageEffect(effect, 10);
    damage.target = benched;
    store.reduceEffect(state, damage);
  }
});
```

### Damage All Opponent's Pokemon

```typescript
// Active
const damageActive = new DealDamageEffect(effect, 30);
damageActive.target = opponent.active;
store.reduceEffect(state, damageActive);

// Bench (use PutDamageEffect - no weakness/resistance)
opponent.bench.forEach(benched => {
  if (benched.cards.length > 0) {
    const damage = new PutDamageEffect(effect, 30);
    damage.target = benched;
    store.reduceEffect(state, damage);
  }
});
```

---

## Trainer Prefabs

### Detection

```typescript
if (WAS_TRAINER_USED(effect, this)) {
  const player = effect.player;
  // Trainer logic
}
```

### Common Trainer Operations

| Operation | Code |
|-----------|------|
| Discard cards from hand | `DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, min, max)` |
| Shuffle deck | `SHUFFLE_DECK(store, state, player)` |
| Check if supporter can be played | `CAN_PLAY_SUPPORTER_CARD(store, state, player, this)` |
| Check if trainer can be played | `CAN_PLAY_TRAINER_CARD(store, state, player, this)` |

### Generator Pattern for Multi-Step Trainers

```typescript
public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  if (effect instanceof TrainerEffect && effect.trainerCard === this) {
    const generator = playCard(() => generator.next(), store, state, this, effect);
    return generator.next().value;
  }
  return state;
}

function* playCard(next: Function, store: StoreLike, state: State,
                   self: TrainerCard, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  // Move to supporter zone, prevent default discard
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  effect.preventDefault = true;

  // First prompt
  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(...), selected => {
    cards = selected || [];
    next();
  });

  // Process selection
  // ...

  // Move to discard when done
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  return SHUFFLE_DECK(store, state, player);
}
```

**Import:** `from '../../game/store/prefabs/trainer-prefabs'` (WAS_TRAINER_USED, DISCARD_X_CARDS_FROM_YOUR_HAND)

---

## Energy Card Prefabs

### Check if Special Energy is Blocked

```typescript
if (effect instanceof SomeEffect) {
  const attachedTo = StateUtils.findPokemonSlot(state, this);
  if (IS_SPECIAL_ENERGY_BLOCKED(store, state, player, this, attachedTo)) {
    return state;  // Effect blocked
  }
  // Apply energy effect
}
```

### Providing Multiple/Conditional Energy Types

```typescript
// In reduceEffect
if (effect instanceof CheckProvidedEnergyEffect) {
  const attachedTo = effect.source;

  // Check if this energy is attached to the Pokemon being checked
  if (!attachedTo.cards.includes(this)) {
    return state;
  }

  // MANDATORY: Check if special energy effects are blocked before modifying
  try {
    const energyEffect = new EnergyEffect(effect.player, this);
    store.reduceEffect(state, energyEffect);
  } catch {
    return state;
  }

  // Find this energy in the map and modify what it provides
  effect.energyMap.forEach(em => {
    if (em.card === this) {
      // Example: provide any type
      em.provides = [CardType.ANY, CardType.ANY];
    }
  });
}
```

---

## Grammar Variations by Era

Pokemon card text has changed over the years. All variations map to the same code:

### "Defending Pokemon" vs "Your opponent's Active Pokemon"

| Era | Text | Code |
|-----|------|------|
| Classic (BW and earlier) | "The Defending Pokemon is now Paralyzed." | `YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(...)` |
| Modern (XY onward) | "Your opponent's Active Pokemon is now Paralyzed." | Same |

### Flip Results

| Era | Text | Code |
|-----|------|------|
| Classic | "Flip a coin. If heads, the Defending Pokemon is now Paralyzed." | `COIN_FLIP_PROMPT` + condition prefab |
| Modern | "Flip a coin. If heads, your opponent's Active Pokemon is now Paralyzed." | Same |

### Damage Wording

| Era | Text | Code |
|-----|------|------|
| Classic | "Does 10 damage to 1 of your opponent's Benched Pokemon." | `THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON` |
| Modern | "This attack also does 10 damage to 1 of your opponent's Benched Pokemon." | Same |
| Modern | "This attack does 10 damage to 1 of your opponent's Benched Pokemon. (Don't apply Weakness and Resistance for Benched Pokemon.)" | Same (PutDamageEffect handles this) |

### Self-Damage

| Era | Text | Code |
|-----|------|------|
| Classic | "Flip a coin. If tails, this Pokemon does 10 damage to itself." | `THIS_POKEMON_DOES_DAMAGE_TO_ITSELF` |
| Modern | "This Pokemon also does 10 damage to itself." | Same |

### Search Instructions

| Era | Text | Code |
|-----|------|------|
| Classic | "Search your deck for a Basic Pokemon card, show it to your opponent, and put it into your hand. Shuffle your deck afterward." | `SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND` (handles show + shuffle) |
| Modern | "Search your deck for a Basic Pokemon, reveal it, and put it into your hand. Then, shuffle your deck." | Same |

### Energy Attachment

| Era | Text | Code |
|-----|------|------|
| Classic | "Attach a [R] Energy card from your discard pile to this Pokemon." | Manual `moveCardTo` or `ATTACH_ENERGY_PROMPT` |
| Modern | "Attach a basic [R] Energy card from your discard pile to this Pokemon." | Same (note: "basic" added for clarity) |

### "[R] Energy cards" vs "basic [R] Energy cards"

When card text refers to `[R] Energy cards` (or any type shorthand), this means **basic energy only** unless specified otherwise. Check `card.energyType === EnergyType.BASIC` in addition to `card.provides.includes(CardType.FIRE)`. Do NOT match special energies that happen to provide the type.

```typescript
// CORRECT: "[R] Energy cards" = basic Fire Energy only
card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.provides.includes(CardType.FIRE)

// WRONG: matches special energies too
card instanceof EnergyCard && card.provides.includes(CardType.FIRE)
```

Reference: `set-ancient-origins/entei.ts` (Burning Roar)

### Key Principle

**Normalize all text variations to the same code pattern.** The prefabs are designed to handle the game mechanics regardless of how the text is worded. When in doubt, search for existing implementations of similar effects.

---

## "Can't Apply More Than 1" Ability Stacking Prevention

When multiple copies of the same Pokemon with a passive ability are in play, only one should apply. Use the "find first instance" pattern:

```typescript
// In the passive ability intercept (e.g., DealDamageEffect, CheckHpEffect):
let firstInstance: MyCard | undefined;
player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
  const card = cardList.getPokemonCard();
  if (card instanceof MyCard && !firstInstance) {
    firstInstance = card;
  }
});
if (firstInstance !== this) {
  return state; // Skip — another copy is already applying this effect
}
// Apply the ability effect...
```

Reference: `set-cosmic-eclipse/flareon.ts` (Power Cheer), `set-cosmic-eclipse/jolteon.ts` (Speed Cheer), `set-cosmic-eclipse/vaporeon.ts` (Vitality Cheer)

---

## Swift / Full Damage Bypass

There are three levels of damage bypass. Choose the correct one based on card text:

| Card Text | Code | What It Bypasses |
|-----------|------|------------------|
| "not affected by Weakness or Resistance" | `effect.ignoreWeakness = true; effect.ignoreResistance = true;` | W/R only |
| "not affected by any effects on the Defending Pokemon" | `THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, baseDamage)` | Defensive effects only (still applies W/R) |
| "not affected by Weakness, Resistance, or any other effects" (Swift) | Manual pattern below | Everything: W/R AND effects |

### Swift Pattern (bypasses ALL damage modifiers)

```typescript
// Ref: set-next-destinies/starmie.ts (Swift)
if (WAS_ATTACK_USED(effect, 0, this)) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Dispatch ApplyWeaknessEffect so interceptors see the attack
  const applyWeakness = new ApplyWeaknessEffect(effect, 80);
  store.reduceEffect(state, applyWeakness);

  // Zero out normal damage pipeline
  effect.damage = 0;

  // Apply flat damage directly, bypassing all modifiers
  opponent.active.damage += 80;

  // Dispatch AfterDamageEffect for damage tracking
  const afterDamage = new AfterDamageEffect(effect, 80);
  state = store.reduceEffect(state, afterDamage);
}
```

Reference: `set-next-destinies/starmie.ts`, `set-breakthrough/sandslash.ts`

---

## SelectPrompt for Multi-Option Supporters

When a Supporter lets the player choose between two effects (e.g., Giovanni's Scheme):

```typescript
// Ref: set-breakthrough/giovannis-scheme.ts
const options: { message: GameMessage, action: () => void }[] = [
  { message: GameMessage.DRAW_CARDS, action: () => { DRAW_CARDS(player, 5); } },
  { message: GameMessage.DEAL_MORE_DAMAGE, action: () => { /* set marker */ } }
];

return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.SELECT_OPTION, options);
```

Reference: `set-breakthrough/giovannis-scheme.ts`

---

## Retreat Blocking (3-call pattern)

When card text says "The Defending Pokemon can't retreat during your opponent's next turn":

```typescript
import { MarkerConstants } from '../../game/store/prefabs/prefabs';

// In WAS_ATTACK_USED block (MUST return the result):
return BLOCK_RETREAT(store, state, effect, this);

// Separate calls (order matters) — MUST use MarkerConstants, not a custom marker:
BLOCK_RETREAT_IF_MARKER(effect, this, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
```

All three calls are needed: `BLOCK_RETREAT` sets `MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER` on the defender, `BLOCK_RETREAT_IF_MARKER` intercepts retreat attempts, and `REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN` cleans up.

> **IMPORTANT**: `BLOCK_RETREAT()` returns `State`. You **must** `return` its result. If combining with other effects (e.g., burn + block retreat), apply the non-returning effects first, then `return BLOCK_RETREAT(...)`:
> ```typescript
> YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
> return BLOCK_RETREAT(store, state, effect, this);
> ```

> **WARNING**: Do NOT use a custom marker string (e.g., `this.BLOCK_RETREAT_MARKER`). `BLOCK_RETREAT()` always sets `MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER` internally, so `BLOCK_RETREAT_IF_MARKER` and `REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN` must check the same marker. Using a different marker name is a silent failure — retreat will never be blocked.

---

## "Search your deck for X different types of basic Energy cards"

Use `differentTypes: true` option in `ChooseCardsPrompt`:

```typescript
store.prompt(state, new ChooseCardsPrompt(
  player.id,
  GameMessage.CHOOSE_CARD_TO_HAND,
  player.deck,
  { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
  { min: 0, max: 3, allowCancel: false, differentTypes: true }
), cards => {
  // ...
});
```

Reference: `set-surging-sparks/energy-search-pro.ts`

---

## Ability `useWhenInPlay` Convention

**`useWhenInPlay: true`** — ONLY for **activated** abilities that the player clicks to use. These are handled by `WAS_POWER_USED` in `reduceEffect`.

**Omit `useWhenInPlay`** — For **passive** abilities that intercept effects automatically. These trigger via effect interception (e.g., `DealDamageEffect`, `CheckPokemonStatsEffect`, `AttachEnergyEffect`, `PlayPokemonEffect`) and have no player-activated trigger.

| Ability Type | `useWhenInPlay` | Handler Pattern | Examples |
|-------------|----------------|-----------------|----------|
| Activated (click to use) | `true` | `WAS_POWER_USED(effect, 0, this)` | Victreebel FFI (Wafting Scent), Gothitelle FFI (Teleport Room) |
| Passive (auto-triggers) | omit | `effect instanceof DealDamageEffect` etc. | Klefki FFI (Secret Key), Noivern FFI (Echolocation), Eevee FFI (Energy Evolution) |

**Why this matters:** Setting `useWhenInPlay: true` on a passive ability creates a non-functional "use ability" button in the game UI.

---

## Weakness Type Override

"The Defending Pokemon's Weakness is now [Type] until the end of your next turn."

Uses `CheckPokemonStatsEffect` to intercept and override the weakness array. The `value` field in `{ type, value? }` should preserve the existing weakness amount when present, or default to `undefined` (which means x2 for modern cards). Uses 2-phase marker pattern for "until the end of your next turn." Reference: `set-phantom-forces/pachirisu.ts` (Trick Sticker).

---

## Unimplementable Effects Convention

When a card effect cannot be implemented with the current engine:
- Use `// TODO:` comment (not `// Ref:`) to flag it
- Explain the limitation clearly
- Reference other cards with the same limitation
- Do NOT leave empty `if` blocks or unused imports

Example:
```typescript
// TODO: "Treat all opponent coin flips as tails" is not currently implementable in the engine.
// See also: set-plasma-freeze/cofagrigus-2.ts (same limitation)
```

---

## Selective Weakness/Resistance Modification

### Remove a specific weakness type

When card text says "Pokemon of [type] have no Weakness" or "remove [type] Weakness", intercept `CheckPokemonStatsEffect` and filter:

```typescript
if (effect instanceof CheckPokemonStatsEffect) {
  // ... find all Pokemon this applies to, check IS_ABILITY_BLOCKED ...
  effect.weakness = effect.weakness.filter(w => w.type !== CardType.PSYCHIC);
}
```

Do NOT use `ignoreWeakness = true` — that removes ALL weakness types.

Reference: `set-unified-minds/jirachi-gx.ts` (Psychic Zone)

---

## Random Card Selection (Non-Coin-Flip)

### Discard a random card from opponent's hand

```typescript
// "Discard a random card from your opponent's hand."
if (opponent.hand.cards.length > 0) {
  const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
  const randomCard = opponent.hand.cards[randomIndex];
  opponent.hand.moveCardTo(randomCard, opponent.discard);
}
```

`Math.random()` is allowed for non-coin-flip randomness (shuffling, random selection). Only coin flips must use `COIN_FLIP_PROMPT`.

Reference: `set-unified-minds/skorupi.ts`, `set-sun-and-moon/mars.ts`

---

## Common Gotchas

### "You may" vs mandatory actions
- **"Move an Energy"** / **"Switch your opponent's Pokemon"** = mandatory (`min: 1, allowCancel: false`)
- **"You may switch"** / **"you may draw"** = optional (use `ConfirmPrompt` before the action, or `min: 0`)
- Example mistake: Coding an optional switch as mandatory (missing `ConfirmPrompt`), or a mandatory energy move as optional (`min: 0`)

### Damage `=` vs `+=` for "X+" cards
When a card has `damageCalculation: '+'` (printed as e.g. "10+"), the `effect.damage` already contains the base damage value. Always use `+=` for the bonus, never `=`:
```typescript
// CORRECT: preserves base damage
effect.damage += 50 * energyCount;

// WRONG: overwrites base damage (gives 0 when energyCount is 0)
effect.damage = 50 * energyCount;
```

### Damage reduction: use `Math.max(0, ...)`
When reducing damage, always use `Math.max(0, ...)` to prevent negative damage values (which could cause unintended healing):
```typescript
// CORRECT: prevents negative damage
effect.damage = Math.max(0, effect.damage - 20);

// RISKY: could go negative if attack does less than 20
effect.damage -= 20;
```

### Energy counting: `.length` vs `.reduce()` for energyMap
When counting energy attached to a Pokemon, there are two different approaches depending on what you need:

```typescript
// Count energy CARDS (number of energy card objects):
checkEnergy.energyMap.length

// Count total energy PROVIDED (accounts for multi-energy cards like DCE):
checkEnergy.energyMap.reduce((total, p) => total + p.provides.length, 0)
```

**IMPORTANT:** For card text like "for each Energy attached" or "+X damage for each Energy", always use `.reduce()` since Double Colorless and other multi-energy cards provide 2+ energy from a single card.

### Retreat cost type filtering
When card text references specific types in retreat cost:

```typescript
// "for each Colorless in Retreat Cost" - filter for Colorless only:
checkRetreat.cost.filter(c => c === CardType.COLORLESS).length

// "for each Energy in Retreat Cost" - count all:
checkRetreat.cost.length
```

### Energy counting on opponent's Pokemon (for "X damage for each Energy attached to opponent")

When counting energy on any Pokemon (yours or opponent's), use `CheckProvidedEnergyEffect` + `.reduce()` to account for multi-energy cards:

```typescript
const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
store.reduceEffect(state, checkEnergy);
const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
effect.damage = 20 * totalEnergy;
```

Do NOT count energy cards directly (`.filter(c => c instanceof EnergyCard).length`) — this undercounts DCE and similar multi-energy cards.

Reference: `set-lost-thunder/espeon.ts` (Energy Crush)

### "When this Pokemon is damaged by an attack" abilities

Use the `ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT` prefab for abilities that trigger when the Pokemon takes damage:

```typescript
if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(effect, this)) {
  // Effect triggers after being damaged
}
```

This handles `AfterDamageEffect` type guard and active slot check.

Reference: `set-lost-thunder/shiinotic.ts`

### "When this Pokemon moves from Bench to Active" abilities

Use the `movedToActiveThisTurn` boolean with marker-based once-per-turn enforcement:

```typescript
if (effect instanceof BetweenTurnsEffect && this.movedToActiveThisTurn) {
  // Trigger the ability
}
```

Reference: `set-lost-thunder/xerneas.ts` (Path of Life)

### "Search for Pokemon with a specific named attack"

When card text says "search for a Pokemon that has the [Attack Name] attack", use a `blocked` array on `ChooseCardsPrompt` to filter out Pokemon without that attack:

```typescript
const blocked: number[] = [];
player.deck.cards.forEach((c, index) => {
  if (!(c instanceof PokemonCard) || !c.attacks.some(a => a.name === 'Nuzzle')) {
    blocked.push(index);
  }
});
// Pass blocked to ChooseCardsPrompt options
```

Reference: `set-team-up/emolga.ts` (Nuzzly Gathering)

### "If you have used your GX attack" condition

When card text gives a bonus for having used your GX attack, check `player.usedGX`:

```typescript
if (player.usedGX) {
  effect.damage += 70;
}
```

Reference: `set-team-up/skarmory.ts` (Calm Strike)

### Trainer Effect Prevention (TrainerTargetEffect)

For abilities like "prevent all effects of Item or Supporter cards done to this Pokemon", intercept `TrainerTargetEffect`:

```typescript
if (effect instanceof TrainerTargetEffect && effect.target?.cards.includes(this)) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  if (effect.player === opponent && !IS_ABILITY_BLOCKED(store, state, player, this)) {
    effect.target = undefined; // Nullify the targeting
  }
}
```

Reference: `set-team-up/galvantula.ts` (Unnerve), `set-forbidden-light/pyroar.ts` (Unnerve)

### Energy type counting must include CardType.ANY

When counting energy of a specific type from `CheckProvidedEnergyEffect.energyMap.provides`, you MUST include `CardType.ANY` — special energy like Rainbow Energy provides `CardType.ANY`, not the specific type it satisfies:

```typescript
// CORRECT: counts both native Lightning energy AND multi-type energy
const lightningCount = checkEnergy.energyMap.reduce((sum, em) =>
  sum + em.provides.filter(t => t === CardType.LIGHTNING || t === CardType.ANY).length, 0);

// WRONG: misses Rainbow Energy and similar multi-type energy
const lightningCount = checkEnergy.energyMap.reduce((sum, em) =>
  sum + em.provides.filter(t => t === CardType.LIGHTNING).length, 0);
```

Reference: `set-cosmic-eclipse/raichu.ts` (Powerful Spark), `set-team-up/mareep.ts`

### `moveTo()` does NOT move tools

When shuffling/discarding/bouncing an entire Pokemon to another zone, `cardList.moveTo()` only moves `cards` and `energies`, NOT `tools`. You must explicitly handle the tools array:

```typescript
// Move tools first
cardList.tools.slice().forEach(tool => {
  cardList.moveCardTo(tool, destination);
});
// Then move the rest
cardList.moveTo(destination);
```

Reference: `set-cosmic-eclipse/togepi-and-cleffa-and-igglybuff-gx.ts` (Supreme Puff-GX)

### Stadium existence check: use StateUtils.getStadiumCard

To check if any Stadium card is in play, use `StateUtils.getStadiumCard(state)`. Do NOT use `player.stadium.cards.length > 0` — that only checks one player's stadium slot, but stadiums are shared:

```typescript
// CORRECT: checks for any stadium in play
if (StateUtils.getStadiumCard(state) !== undefined) { ... }

// WRONG: only checks current player's stadium slot
if (player.stadium.cards.length > 0) { ... }
```

Reference: `set-cosmic-eclipse/black-kyurem.ts`
