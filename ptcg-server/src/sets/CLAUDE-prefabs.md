# Prefab Reference

All prefabs are imported from `../../game/store/prefabs/{filename}`.

---

## Main Prefabs (`prefabs/prefabs.ts`)

### New Additions (2026-02-11)
```typescript
// ---------- Energy / Attach / Mill ----------

// "As often as you like... attach a basic [type] Energy from hand"
AS_OFTEN_AS_YOU_LIKE_ATTACH_BASIC_TYPE_ENERGY_FROM_HAND(store, state, player, cardType, options?): State
// options: { destinationSlots?, targetFilter?, promptOptions? }

// "Attach up to X [type] Energy from discard to 1 of your Pokemon"
ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, amount, cardType?, options?): State
// options: { destinationSlots?, targetFilter?, energyFilter?, min?, allowCancel? }

// "Attach up to X Energy from deck to Y of your Pokemon"
ATTACH_UP_TO_X_ENERGY_FROM_DECK_TO_Y_OF_YOUR_POKEMON(store, state, player, maxEnergyCards, maxPokemonTargets, options?): State
// options: {
//   destinationSlots?, targetFilter?, energyFilter?, min?, allowCancel?,
//   differentTypes?, differentTargets?, sameTarget?, validCardTypes?, maxPerType?
// }
// Mirage Gate pattern: pass energyFilter { energyType: EnergyType.BASIC } and differentTypes: true

// Self-mill helper
DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, amount, sourceCard, sourceEffect): void

// ---------- VSTAR / Counters / Energy checks ----------

BLOCK_IF_VSTAR_POWER_USED(player): void
PLAYER_HAS_USED_VSTAR_POWER(player): boolean
OPPONENT_HAS_USED_VSTAR_POWER(state, player): boolean

COUNT_MATCHING_CARDS_IN_ZONE(player, zone, filter?, predicate?): number
// zone: 'discard' | 'lostzone'
// Supports Night March / United Wings style predicates (attack-name checks, tags, etc.)

THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED(target): boolean

// ---------- Bench protection ----------

PREVENT_DAMAGE_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, options): void
PREVENT_EFFECTS_TO_YOUR_BENCHED_POKEMON_FROM_OPPONENT_ATTACKS(store, state, effect, options): void
// options: {
//   owner, source?, includeSourcePokemon?, targetFilter?, checkBlocked?
// }
// "other Benched Pokemon" => keep includeSourcePokemon false (default)

// ---------- Special Conditions ----------

PREVENT_AND_CLEAR_SPECIAL_CONDITIONS(state, effect, options): void
// options: { shouldApply, clearDuringCheckTableState? }
// Prevents future Special Conditions and clears existing ones for matching Pokemon.

// ---------- Attack restrictions / triggers ----------

THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(player, attackOrAttackName): void
THIS_POKEMON_CANNOT_ATTACK_NEXT_TURN(player): void

ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, options): effect is AfterDamageEffect
// options: { source, requireActiveSpot?, requireAttackPhase? }

// ---------- Gust / damage counter movement ----------

GUST_OPPONENT_BENCHED_POKEMON(store, state, player, options?): State
// options: { allowCancel?, blocked? }

MOVE_DAMAGE_COUNTERS(store, state, player, options?): State
// options: {
//   playerType?, slots?, min?, max?, allowCancel?,
//   blockedFrom?, blockedTo?, singleSourceTarget?, singleDestinationTarget?
// }

// ---------- Flip-until-tails consolidation ----------

FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, callback): State
// Used by attack-effects flip-until-tails prefabs to avoid duplicated recursion.

// ---------- Top-deck family ----------

LOOK_AT_TOP_X_CARDS_AND_DO_WITH_MATCHING(store, state, player, options): State
// options: {
//   topCount, maxMatches, filter?, predicate?, chooseMessage?, allowCancel?,
//   remainderDestination?, onCardsChosen
// }
// Note: onCardsChosen is intended for synchronous card movement.

LOOK_AT_TOP_X_CARDS_AND_PUT_UP_TO_Y_MATCHING_CARDS_INTO_HAND(store, state, player, topCount, maxToHand, options?): State
LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(store, state, player, topCount, maxEnergyToAttach, options?): State
LOOK_AT_TOP_X_CARDS_AND_BENCH_UP_TO_Y_POKEMON(store, state, player, topCount, maxToBench, options?): State
// All wrappers support remainderDestination: 'shuffle' | 'bottom' | 'discard' | 'lostzone'
```

### Attack/Power/Effect Detection (Type Guards)
```typescript
// Check if specific attack was used - returns typed AttackEffect
WAS_ATTACK_USED(effect, index, this): effect is AttackEffect

// Check if specific power/ability was used - returns typed PowerEffect
WAS_POWER_USED(effect, index, this): effect is PowerEffect

// Check if attack effect occurred AFTER damage (for post-damage effects like switching)
// CRITICAL: Use this for effects that should happen after damage is dealt!
AFTER_ATTACK(effect, index, this): effect is AfterAttackEffect

// Type guard for DealDamageEffect
DEAL_DAMAGE(effect): effect is DealDamageEffect

// Type guard for PutDamageEffect
PUT_DAMAGE(effect): effect is PutDamageEffect

// Check if this card just evolved
JUST_EVOLVED(effect, card): effect is EvolveEffect

// Check if passive ability triggered on KO (card is being knocked out)
PASSIVE_ABILITY_ACTIVATED(effect, user): boolean
```

### Visual Indicators
```typescript
// Add "ability used" visual indicator to Pokemon
ABILITY_USED(player, card): void
```

### Drawing Cards
```typescript
// Draw X cards from deck to hand
DRAW_CARDS(player, count): void

// Let player choose to draw 0 to X cards
DRAW_UP_TO_X_CARDS(store, state, player, count): State

// Draw cards until player has X cards in hand
DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, count): void

// Draw X cards from deck as face-down prize cards
DRAW_CARDS_AS_FACE_DOWN_PRIZES(player, count): void
```

### Searching
```typescript
// Search deck for Pokemon, show to opponent, put in hand, shuffle deck
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, filter?, options?): State

// Search deck for Pokemon, put onto bench slots, shuffle deck
SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, filter?, options?): State

// Search deck for any cards matching filter, put in hand, shuffle deck
SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, sourceCard, filter?, options?, sourceEffect?): void

// Search discard pile for cards, show to opponent, put in hand
SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(store, state, player, sourceCard, filter?, options?, sourceEffect?): void

// Get cards from bottom of deck
GET_CARDS_ON_BOTTOM_OF_DECK(player, amount = 1): Card[]
```

### Moving Cards
```typescript
// Find card anywhere in state and move to destination
MOVE_CARD_TO(state, card, destination): void

// Move cards between CardLists with options
MOVE_CARDS(store, state, source, destination, options?): State
// Options: { cards?, count?, toTop?, toBottom?, skipCleanup?, sourceCard?, sourceEffect? }

// Move cards to player's hand (with logging)
MOVE_CARDS_TO_HAND(store, state, player, cards): void

// Shuffle player's deck
SHUFFLE_DECK(store, state, player): State

// Put cards into deck then shuffle
SHUFFLE_CARDS_INTO_DECK(store, state, player, cards): void

// Shuffle all prize cards into deck
SHUFFLE_PRIZES_INTO_DECK(store, state, player): void
```

### Damage
```typescript
// Add damage to attack effect
THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage): State

// Deal more damage if opponent's active has specific CardTag(s)
DEAL_MORE_DAMAGE_IF_OPPONENT_ACTIVE_HAS_CARD_TAG(effect, state, damage, ...cardTags): void

// Deal more damage based on opponent's prizes taken
DEAL_MORE_DAMAGE_FOR_EACH_PRIZE_CARD_TAKEN(effect, state, damage): void

// This Pokemon deals damage to itself
THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, amount): State

// Choose X of opponent's Pokemon to deal damage to
THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state, min, max, applyWeaknessAndResistance?, slots?): State

// Deal damage to specific target Pokemon
DAMAGE_OPPONENT_POKEMON(store, state, effect, damage, targets): void

// Heal damage from attacking Pokemon
HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, damage): State

// Check if damage would KO from full HP
DAMAGED_FROM_FULL_HP(store, state, effect, player, target): boolean

// Get total energy attached to all of player's Pokemon
GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(player, store, state): number
```

### Compound Prefabs (Preferred For Repeated Text Patterns)
```typescript
// "During your next turn, this Pokemon's [Attack] attack does [N] more damage."
NEXT_TURN_ATTACK_BONUS(effect, {
  attack: this.attacks[0],
  source: this,
  bonusDamage: 30,
  bonusMarker: 'NEXT_TURN_MORE_DAMAGE_MARKER',
  clearMarker: 'NEXT_TURN_MORE_DAMAGE_MARKER_2'
}): void

// "Choose 1 of your Benched Pokemon's attacks and use it as this attack."
COPY_BENCH_ATTACK(store, state, effect, options?): State
// options: { allowCancel?, throwIfNoBenchedPokemon?, disallowCopycatAttack? }

// Tool text: "If this card is attached to [condition], attacks do +N to Active"
TOOL_ACTIVE_DAMAGE_BONUS(store, state, effect, this, {
  damageBonus: 50,
  sourcePokemonName: 'White Kyurem-EX'
}): void
// condition keys: sourcePokemonName?, sourceCardType?, sourceCardTag?

// Tool text: "If this card is attached to [condition], its maximum HP is N."
TOOL_SET_HP_IF(store, state, effect, this, {
  hp: 300,
  sourcePokemonName: 'Black Kyurem-EX'
}): void
// condition keys: sourcePokemonName?, sourceCardType?, sourceCardTag?

// Sturdy/Focus Sash style "survive at 10 HP from full HP"
SURVIVE_ON_TEN_IF_FULL_HP(store, state, effect, {
  source: this, // PokemonCard or TrainerCard
  reason: this.powers[0].name,
  checkBlocked: true
}): void

// "Devolve the Defending Pokemon and put highest Stage card into opponent hand/deck/discard/lost zone."
DEVOLVE_DEFENDING_AFTER_ATTACK(store, state, effect, 0, this, 'hand'): State
```

**Exact text candidates:**
- `NEXT_TURN_ATTACK_BONUS`
  Use when text explicitly says: `During your next turn, this Pokemon's [attack] attack does [N] more damage`.
- `COPY_BENCH_ATTACK`
  Use when text explicitly says: `Choose 1 of your Benched Pokemon's attacks and use it as this attack` (optionally coin-gated).
- `TOOL_ACTIVE_DAMAGE_BONUS`
  Use when a Tool says attached Pokemon's attacks do more damage to the `Active Pokemon`.
- `TOOL_SET_HP_IF`
  Use when a Tool sets max HP to a fixed number under an attached-Pokemon condition.
- `SURVIVE_ON_TEN_IF_FULL_HP`
  Use when text says `has full HP` and `would be Knocked Out by damage from an attack` and survives on `10 HP`.
- `DEVOLVE_DEFENDING_AFTER_ATTACK`
  Use when text says `Devolve the Defending Pokemon` and move highest Stage card to a destination.

**When NOT to use:**
- Do not use `NEXT_TURN_ATTACK_BONUS` for effects that buff any attack (not a named attack).
- Do not use `TOOL_ACTIVE_DAMAGE_BONUS` if card text also boosts bench damage.
- Do not use `SURVIVE_ON_TEN_IF_FULL_HP` for non-damage KO effects (`Knock Out` without damage).

### Prizes
```typescript
// Prompt player to choose and take X prize cards
TAKE_X_PRIZES(store, state, player, count, options?, callback?): State

// Take specific prize card slots (no prompt)
TAKE_SPECIFIC_PRIZES(store, state, player, prizes, options?): void

// Get prize slots that have cards
GET_PLAYER_PRIZES(player): CardList[]

// Get all prize cards as flat array
GET_PRIZES_AS_CARD_ARRAY(player): Card[]

// Increase prize count on KO effect
TAKE_X_MORE_PRIZE_CARDS(effect, state): State
```

### Energy
```typescript
// Prompt to attach energy from source to Pokemon
ATTACH_ENERGY_PROMPT(store, state, player, playerType, sourceSlot, destinationSlots, filter?, options?): State

// Discard energy cards from hand
DISCARD_X_ENERGY_FROM_YOUR_HAND(effect, store, state, minAmount, maxAmount): State

// Discard all energy from a Pokemon
DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, card): void
```

### Blocking Checks (returns true if blocked)
```typescript
// Check if abilities are blocked for this card
IS_ABILITY_BLOCKED(store, state, player, card): boolean

// Check if Poke-Bodies are blocked (older cards)
IS_POKEBODY_BLOCKED(store, state, player, card): boolean

// Check if Poke-Powers are blocked (older cards)
IS_POKEPOWER_BLOCKED(store, state, player, card): boolean

// Check if Pokemon Powers are blocked (classic cards)
IS_POKEMON_POWER_BLOCKED(store, state, player, card): boolean

// Check if tool effects are blocked
IS_TOOL_BLOCKED(store, state, player, card): boolean

// Check if special energy effects are blocked
IS_SPECIAL_ENERGY_BLOCKED(store, state, player, card, attachedTo, exemptFromOpponentsSpecialEnergyBlockingAbility?): boolean
```

### Prompts
```typescript
// Flip a coin, callback receives boolean result
COIN_FLIP_PROMPT(store, state, player, callback): State

// Flip multiple coins, callback receives boolean[] results
MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, amount, callback): State

// Simulate coin flip without prompt (for automatic effects)
SIMULATE_COIN_FLIP(store, state, player): boolean

// Yes/No confirmation prompt
CONFIRMATION_PROMPT(store, state, player, callback, message?): State

// Select from list of string options
SELECT_PROMPT(store, state, player, values, callback): State

// Select from options with actions
SELECT_PROMPT_WITH_OPTIONS(store, state, player, message, options): State
// options: { message: GameMessage, action: () => void }[]

// Show cards to a player
SHOW_CARDS_TO_PLAYER(store, state, player, cards): State

// Prompt player to switch active with benched Pokemon
SWITCH_ACTIVE_WITH_BENCHED(store, state, player): State

// Look at top card of deck, choose to discard or return
LOOK_AT_TOPDECK_AND_DISCARD_OR_RETURN(store, state, choosingPlayer, deckPlayer): void
```

### Blocking/Validation (throws GameError if condition met)
```typescript
// Throw if player's deck is empty
BLOCK_IF_DECK_EMPTY(player): void

// Throw if player's discard is empty
BLOCK_IF_DISCARD_EMPTY(player): void

// Throw if no bench slots available
BLOCK_IF_NO_SLOTS(slots): void

// Throw if GX attack already used this game
BLOCK_IF_GX_ATTACK_USED(player): void

// Throw if active Pokemon has any special condition
BLOCK_IF_HAS_SPECIAL_CONDITION(player, source): void

// Throw if active has Asleep/Confused/Paralyzed (also includes Poison/Burn per errata)
BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, source): void
```

### Markers
```typescript
// Add marker to owner (Player, Card, PokemonCard, or PokemonCardList)
ADD_MARKER(marker, owner, source): void

// Remove marker from owner
REMOVE_MARKER(marker, owner, source?): boolean

// Check if owner has marker
HAS_MARKER(marker, owner, source?): boolean

// Enforce "Once during your turn" for activated abilities
// Throws GameError(GameMessage.POWER_ALREADY_USED) if already used this turn
USE_ABILITY_ONCE_PER_TURN(player, marker, source): void

// Check if card has specific tag
HAS_TAG(tag, source): boolean

// Throw GameError if marker exists
BLOCK_EFFECT_IF_MARKER(marker, owner, source?): void

// Prevent damage if target has marker
PREVENT_DAMAGE_IF_TARGET_HAS_MARKER(effect, marker, source?): void

// Prevent damage if source card has tag
PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect, tag, source): void

// Remove marker at end of turn (use in EndTurnEffect handler)
REMOVE_MARKER_AT_END_OF_TURN(effect, marker, source): void

// Remove marker from active Pokemon at end of turn
REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, marker, source): void

// Replace one marker with another at end of turn
REPLACE_MARKER_AT_END_OF_TURN(effect, oldMarker, newMarker, source): void

// Clear player marker and all opponent's Pokemon markers (for "during opponent's next turn" effects)
CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(state, effect, clearerMarker, pokemonMarker, source): void

// Throw GameError if retreat attempted with marker
BLOCK_RETREAT_IF_MARKER(effect, marker, source): void
```

**Standard once-per-turn ability pattern:**
```typescript
public readonly MY_ABILITY_MARKER = 'MY_ABILITY_MARKER';

if (WAS_POWER_USED(effect, 0, this)) {
  const player = effect.player;

  // card-specific preconditions first...
  USE_ABILITY_ONCE_PER_TURN(player, this.MY_ABILITY_MARKER, this);
  ABILITY_USED(player, this);
  // ability effect...
}

REMOVE_MARKER_AT_END_OF_TURN(effect, this.MY_ABILITY_MARKER, this);
```

### Special Conditions (apply to player's own active - for abilities)
```typescript
// Add special conditions to player's active Pokemon
ADD_SPECIAL_CONDITIONS_TO_PLAYER_ACTIVE(store, state, player, source, specialConditions, poisonDamage?, burnDamage?, sleepFlips?): void

// Convenience functions for specific conditions
ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, source, sleepFlips?): void
ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, source, poisonDamage?): void
ADD_BURN_TO_PLAYER_ACTIVE(store, state, player, source, burnDamage?): void
ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, player, source): void
ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, player, source): void
```

### Bench Helpers
```typescript
// Get first empty bench slot (throws if none)
GET_FIRST_PLAYER_BENCH_SLOT(player): PokemonCardList

// Get all empty bench slots
GET_PLAYER_BENCH_SLOTS(player): PokemonCardList[]

// Play Pokemon from hand to first bench slot
PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, card): void

// Devolve a Pokemon, moving top evolution to destination
DEVOLVE_POKEMON(store, state, target, destination): State
```

### Attack Effects
```typescript
// Create and reduce prevent retreat effect
BLOCK_RETREAT(store, state, effect, source): State

// Create and reduce prevent damage effect
PREVENT_DAMAGE(store, state, effect, source): State

// Tera Pokemon rule - prevent bench damage
TERA_RULE(effect, state, source): void

// Discard stadium card in play
DISCARD_A_STADIUM_CARD_IN_PLAY(state): void
```

### Evolution Helpers
```typescript
// Allow evolution on first turn going second
CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state, player, pokemon): void
```

### Supporter Helpers
```typescript
// Move supporter to discard after use
CLEAN_UP_SUPPORTER(effect, player): void
```

### Card Playability Validation
```typescript
// Check if supporter can be played
CAN_PLAY_SUPPORTER_CARD(store, state, player, trainerCard): boolean

// Check if any trainer can be played
CAN_PLAY_TRAINER_CARD(store, state, player, trainerCard): boolean

// Check if energy can be attached
CAN_PLAY_ENERGY_CARD(store, state, player, energyCard): boolean

// Check if Pokemon can be played/evolved
CAN_PLAY_POKEMON_CARD(store, state, player, pokemonCard): boolean

// Universal card playability check
CAN_PLAY_CARD(store, state, player, card): boolean
```

### Boolean Checks
```typescript
// Check if opponent's Pokemon was KO'd by this attack
YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state): effect is KnockOutEffect

// Check if this Pokemon has damage counters
THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user): boolean
```

---

## Attack Prefabs (`prefabs/attack-effects.ts`)

### Damage Counters
```typescript
// Put X damage counters on opponent's active
PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(x, store, state, effect): State

// Put X damage counters on ALL opponent's Pokemon
PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(x, store, state, effect): void

// Distribute X damage counters among opponent's Pokemon (player chooses)
PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(x, store, state, effect, slotTypes?): State
```

### Targeted Damage
```typescript
// Deal damage to 1 chosen opponent's Pokemon (active or bench)
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(damage, effect, store, state): State

// Deal damage to 1 chosen opponent's BENCHED Pokemon only
THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(damage, effect, store, state): State

// Deal X damage for each Pokemon in discard matching filter
THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(damage, filterFn, effect): void

// Ignore effects on defending Pokemon (deal direct damage)
THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, amount): void
```

### Coin Flips
```typescript
// Flip coin, if heads add damage to attack
FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, amount): void

// "Flip until tails, X damage times heads" (overrides base damage)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads): State

// "Flip until tails, X more damage per heads" (adds to base damage)
FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, damagePerHeads): State

// Shared recursion helper used by both flip-until-tails attack prefabs
FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, callback): State
```

### Drawing
```typescript
// Draw until you have X cards in hand
DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(x, effect, state): void
```

### Healing
```typescript
// Heal X damage from attacking Pokemon
HEAL_X_DAMAGE_FROM_THIS_POKEMON(damage, effect, store, state): void
```

### Card Recovery
```typescript
// Put X Item cards from discard into hand (NOTE: currently hardcoded to Items)
PUT_X_CARDS_FROM_YOUR_DISCARD_PILE_INTO_YOUR_HAND(x, filterFn, store, state, effect): State
```

### Self-Shuffle
```typescript
// Shuffle this Pokemon and all attached cards into deck
// IMPORTANT: Must be called in AFTER_ATTACK, not WAS_ATTACK_USED!
// Reference implementation: set-brilliant-stars/lumineon-v.ts
SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect): State

// Example usage:
if (AFTER_ATTACK(effect, 0, this)) {
  return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
}

// For "You may shuffle" optional effects, use flag pattern:
// 1. Ask in WAS_ATTACK_USED, store result in flag
// 2. Execute in AfterAttackEffect if flag is true
// See: set-crimson-invasion/kartana-gx.ts
```

### Stadium
```typescript
// Discard stadium in play
DISCARD_A_STADIUM_CARD_IN_PLAY(state): void
```

### Special Conditions (apply to opponent's active)
```typescript
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect): void
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect): void
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect): void
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect): void
YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect): void
```

### Opponent Energy Discard
```typescript
// Discard 1 energy from opponent's active (prompts player to choose, uses DiscardCardsEffect)
DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect): State

// For "flip a coin, if heads discard energy":
COIN_FLIP_PROMPT(store, state, effect.player, result => {
  if (result) {
    DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
  }
});
```

---

## Trainer Prefabs (`prefabs/trainer-prefabs.ts`)

```typescript
// Check if this trainer card was played - type guard
WAS_TRAINER_USED(effect, card): effect is TrainerEffect

// Discard X cards from hand (for trainer costs)
DISCARD_X_CARDS_FROM_YOUR_HAND(effect, store, state, minAmount, maxAmount): void

// Show cards to opponent (NOTE: currently shows empty array - may be broken)
TRAINER_SHOW_OPPONENT_CARDS(effect, store, state): void

// Shuffle player's deck (trainer version)
SHUFFLE_DECK(effect, store, state): State
```

---

## Cost Prefabs (`prefabs/costs.ts`)

```typescript
// Discard up to X Energy from this Pokemon (default: optional, all energy)
DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, maxAmount, filter?, minAmount?): State

// Discard up to X Energy from any of your Pokemon (default: Active+Bench, all energy)
DISCARD_UP_TO_X_ENERGY_FROM_YOUR_POKEMON(store, state, effect, maxAmount, filter?, minAmount?, slots?): State

// Discard up to X [type] Energy from any of your Pokemon
DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(store, state, effect, maxAmount, cardType, minAmount?, slots?): State

// Legacy exact-cost helper (kept for compatibility)
DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, amount, type = CardType.COLORLESS): State

// Examples:
// Chien-Pao style "discard any amount of [W] from your Pokemon"
DISCARD_UP_TO_X_TYPE_ENERGY_FROM_YOUR_POKEMON(store, state, effect, 99, CardType.WATER, 0)

// "Discard up to 2 Energy from this Pokemon"
DISCARD_UP_TO_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2)

// "Discard exactly 2 [R] as an attack cost" (legacy exact helper)
DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2, CardType.FIRE)
```

---

## Boolean Prefabs (`prefabs/booleans.ts`)

```typescript
// Check if opponent's Pokemon was KO'd by damage from this attack
YOUR_OPPONENTS_POKEMON_IS_KNOCKED_OUT_BY_DAMAGE_FROM_THIS_ATTACK(effect, state): effect is KnockOutEffect

// Check if attacking Pokemon has any damage counters
THIS_POKEMON_HAS_ANY_DAMAGE_COUNTERS_ON_IT(effect, user): boolean
```

---

## Effect Modifiers (`prefabs/effect-modifiers.ts`)

```typescript
// Add damage to attack (NOTE: hardcoded to 100, may be bug)
THIS_ATTACK_DOES_X_MORE_DAMAGE(effect, store, state, damage): State

// Increase prize count on knockout
TAKE_X_MORE_PRIZE_CARDS(effect, state): State
```

---

## Pre-defined Marker Constants (`prefabs/clear-effect-markers.ts`)

Import: `import { POKEMON_MARKERS } from '../../game/store/prefabs/clear-effect-markers';`

```typescript
POKEMON_MARKERS = {
  // Attack tracking
  ATTACK_USED_MARKER: 'ATTACK_USED_MARKER',
  ATTACK_USED_2_MARKER: 'ATTACK_USED_2_MARKER',

  // Knockout tracking
  KNOCKOUT_MARKER: 'KNOCKOUT_MARKER',
  CLEAR_KNOCKOUT_MARKER: 'CLEAR_KNOCKOUT_MARKER',
  CLEAR_KNOCKOUT_MARKER_2: 'CLEAR_KNOCKOUT_MARKER_2',

  // Damage prevention
  PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN: '...',
  CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN: '...',
  PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER: '...',
  CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER: '...',
  DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: '...',
  CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER: '...',
  PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: '...',
  CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: '...',
  PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER: '...',
  PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: '...',
  CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER: '...',

  // Attack prevention
  PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN: '...',
  CLEAR_PREVENT_OPPONENTS_ACTIVE_FROM_ATTACKING_DURING_OPPONENTS_NEXT_TURN: '...',
  OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER: '...',
  DEFENDING_POKEMON_CANNOT_ATTACK_MARKER: '...',

  // Retreat prevention
  DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: '...',

  // Damage modifiers
  DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: '...',
  CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER: '...',

  // Trainer blocking
  OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER: '...',

  // Specific card markers
  UNRELENTING_ONSLAUGHT_MARKER: '...',
  UNRELENTING_ONSLAUGHT_2_MARKER: '...'
}
```
