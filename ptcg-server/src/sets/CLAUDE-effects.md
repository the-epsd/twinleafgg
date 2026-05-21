# Effects Reference

This document covers effect types, timing, and common patterns.

---

## Effect Timing (CRITICAL!)

Understanding when effects fire is essential for correct implementations.

### AttackEffect vs AfterAttackEffect

| Effect Type | When It Fires | Use For |
|-------------|---------------|---------|
| `AttackEffect` | **Before** damage is dealt | Setting up the attack, modifying damage, paying costs |
| `AfterAttackEffect` | **After** damage is dealt | Switching Pokemon, effects that depend on damage landing |

### Why This Matters

**Wrong** (switch happens before damage):
```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent); // Switches BEFORE damage!
}
```

**Correct** (switch happens after damage):
```typescript
public usedMetalHorns = false;

if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedMetalHorns = true;  // Just set flag
}

if (effect instanceof AfterAttackEffect && this.usedMetalHorns) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);  // Now switch
}

if (effect instanceof EndTurnEffect && this.usedMetalHorns) {
  this.usedMetalHorns = false;  // Clean up
}
```

---

## Game Effects (`game-effects.ts`)

### AttackEffect
Fires when an attack is declared, BEFORE damage calculation and application.

```typescript
if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
  // Modify damage, add costs, set up effects
  effect.damage += 30;
}

// Or use the prefab:
if (WAS_ATTACK_USED(effect, 0, this)) {
  // Attack index 0 was used
}
```

### AfterAttackEffect
Fires after attack damage is dealt. Use for post-damage effects.

```typescript
if (effect instanceof AfterAttackEffect && effect.player.active.getPokemonCard() === this) {
  // Do something after damage
}

// Or use the prefab:
if (AFTER_ATTACK(effect, 0, this)) {
  // After attack index 0
}
```

### PowerEffect
Fires when an ability/power is activated.

```typescript
if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
  // Ability logic
}

// Or use the prefab:
if (WAS_POWER_USED(effect, 0, this)) {
  // Power index 0 was used
}
```

`WAS_POWER_USED` only detects activation. It does **not** enforce
"Once during your turn" by itself. For activated once-per-turn abilities,
use:
```typescript
USE_ABILITY_ONCE_PER_TURN(player, this.MY_ABILITY_MARKER, this);
REMOVE_MARKER_AT_END_OF_TURN(effect, this.MY_ABILITY_MARKER, this);
```

### RetreatEffect
Fires when a Pokemon retreats.

```typescript
if (effect instanceof RetreatEffect) {
  // Can modify retreat cost or block retreat
  effect.cost = []; // Free retreat
}
```

### EvolveEffect
Fires when a Pokemon evolves.

```typescript
if (effect instanceof EvolveEffect) {
  // effect.pokemonCard is the evolution
  // effect.target is the PokemonCardList being evolved
}
```

### KnockOutEffect
Fires when a Pokemon is knocked out.

```typescript
if (effect instanceof KnockOutEffect) {
  // effect.target is the KO'd Pokemon slot
  // effect.prizeCount is prizes to take
}
```

### UseStadiumEffect
Fires when a stadium's effect is used.

```typescript
if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
  // Stadium effect logic
}
```

---

## Game Phase Effects (`game-phase-effects.ts`)

### EndTurnEffect
Fires at the end of a turn. Use for cleanup.

```typescript
if (effect instanceof EndTurnEffect) {
  // Clean up markers, reset flags
  effect.player.marker.removeMarker('MY_MARKER', this);
}
```

### BetweenTurnsEffect
Fires between turns. Handles poison/burn damage, sleep checks.

```typescript
if (effect instanceof BetweenTurnsEffect) {
  // Modify poison/burn damage
  effect.poisonDamage = 40; // Double poison
}
```

### BeginTurnEffect
Fires at the start of a turn.

```typescript
if (effect instanceof BeginTurnEffect) {
  // Start of turn effects
}
```

---

## Attack Effects (`attack-effects.ts`)

### DealDamageEffect
Damage that applies weakness and resistance.

```typescript
const damage = new DealDamageEffect(effect, 50);
damage.target = opponent.active;
store.reduceEffect(state, damage);

// Or intercept existing damage:
if (effect instanceof DealDamageEffect) {
  effect.damage -= 20; // Reduce damage
}
```

### PutDamageEffect
Damage counters that ignore weakness/resistance. Use for bench damage.

```typescript
const put = new PutDamageEffect(effect, 30);
put.target = opponent.bench[0];
store.reduceEffect(state, put);
```

### PutCountersEffect
Place damage counters directly (not "doing damage").

```typescript
const counters = new PutCountersEffect(effect, 20); // 2 damage counters
counters.target = opponent.active;
store.reduceEffect(state, counters);
```

### AfterDamageEffect
Fires after damage from an attack is applied.

```typescript
if (effect instanceof AfterDamageEffect) {
  // Damage was just applied
}
```

### AddSpecialConditionsEffect
Applies special conditions to the target.

```typescript
const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
condition.target = opponent.active;
store.reduceEffect(state, condition);
```

### DiscardCardsEffect
Discards cards from the target Pokemon.

```typescript
const discard = new DiscardCardsEffect(effect, [energyCard]);
discard.target = player.active;
store.reduceEffect(state, discard);
```

### ApplyWeaknessEffect
Explicitly applies weakness to damage.

### HealEffect
Heals damage from a Pokemon.

```typescript
const heal = new HealEffect(effect, 30);
heal.target = player.active;
store.reduceEffect(state, heal);
```

---

## Play Card Effects (`play-card-effects.ts`)

### TrainerEffect
Fires when a trainer card is played.

```typescript
if (effect instanceof TrainerEffect && effect.trainerCard === this) {
  // Trainer logic
}

// Or use the prefab:
if (WAS_TRAINER_USED(effect, this)) {
  // This trainer was played
}
```

### AttachEnergyEffect
Fires when energy is attached to a Pokemon.

```typescript
if (effect instanceof AttachEnergyEffect) {
  // effect.card is the energy
  // effect.target is the Pokemon
}
```

### PlayPokemonEffect
Fires when a Pokemon is played from hand.

```typescript
if (effect instanceof PlayPokemonEffect) {
  // effect.pokemonCard is the Pokemon
}
```

### AttachPokemonToolEffect
Fires when a tool is attached to a Pokemon.

### PlayStadiumEffect
Fires when a stadium is played.

---

## Check Effects (`check-effects.ts`)

Check effects query the game state without modifying it.

### CheckProvidedEnergyEffect
Gets all energy provided by attached cards.

```typescript
const check = new CheckProvidedEnergyEffect(player);
store.reduceEffect(state, check);
// check.energyMap contains all provided energy
```

### CheckHpEffect
Gets a Pokemon's HP (with modifiers).

```typescript
const check = new CheckHpEffect(player, target);
store.reduceEffect(state, check);
// check.hp is the total HP
```

### CheckRetreatCostEffect
Gets a Pokemon's retreat cost (with modifiers).

```typescript
const check = new CheckRetreatCostEffect(player);
store.reduceEffect(state, check);
// check.cost is the retreat cost
```

### CheckPokemonAttacksEffect
Gets available attacks for a Pokemon.

```typescript
const check = new CheckPokemonAttacksEffect(player, source);
store.reduceEffect(state, check);
// check.attacks is the list of available attacks
```

### CheckPokemonTypeEffect
Gets a Pokemon's type (can be modified by effects).

### CheckWeaknessEffect
Gets a Pokemon's weaknesses (can be modified).

### CheckResistanceEffect
Gets a Pokemon's resistances (can be modified).

---

## Common Effect Patterns

### "This Pokemon can't use [Attack] during your next turn"
Use `cannotUseAttacksNextTurnPending` - the system handles the rest:

```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  const player = effect.player;
  if (!player.active.cannotUseAttacksNextTurnPending.includes('Mega Punch')) {
    player.active.cannotUseAttacksNextTurnPending.push('Mega Punch');
  }
}
// NO cleanup needed - system handles it automatically!
```

### "This Pokemon can't attack during your next turn"
Use `cannotAttackNextTurnPending`:

```typescript
if (WAS_ATTACK_USED(effect, 0, this)) {
  effect.player.active.cannotAttackNextTurnPending = true;
}
// NO cleanup needed!
```

### "The Defending Pokemon can't attack during your opponent's next turn"
This affects the OPPONENT, so use markers:

```typescript
public readonly MY_BLOCK_MARKER = 'MY_BLOCK_MARKER';

if (WAS_ATTACK_USED(effect, 0, this)) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  opponent.active.marker.addMarker(this.MY_BLOCK_MARKER, this);
}

// Block attacks (check in AttackEffect)
if (effect instanceof AttackEffect) {
  if (effect.player.active.marker.hasMarker(this.MY_BLOCK_MARKER, this)) {
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }
}

// Cleanup at end of turn
if (effect instanceof EndTurnEffect) {
  effect.player.active.marker.removeMarker(this.MY_BLOCK_MARKER, this);
}
```

### Post-Damage Effect (switching after damage)
Use flag + AfterAttackEffect pattern:

```typescript
public usedMyAttack = false;

// Set flag when attack is used
if (WAS_ATTACK_USED(effect, 0, this)) {
  this.usedMyAttack = true;
}

// Execute effect after damage
if (effect instanceof AfterAttackEffect && this.usedMyAttack) {
  const opponent = StateUtils.getOpponent(state, effect.player);
  SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
}

// Reset flag at end of turn
if (effect instanceof EndTurnEffect && this.usedMyAttack) {
  this.usedMyAttack = false;
}
```

### Preventing Damage
Listen for DealDamageEffect and modify:

```typescript
if (effect instanceof DealDamageEffect) {
  if (effect.target === player.active && someCondition) {
    effect.damage = 0; // Prevent all damage
    // OR
    effect.damage -= 30; // Reduce by 30
  }
}
```

### Blocking Effects
Use `effect.preventDefault = true`:

```typescript
if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.ITEM) {
  if (opponent.marker.hasMarker(player.ATTACK_EFFECT_ITEM_LOCK, this)) {
    effect.preventDefault = true;
    throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
  }
}
```

---

## Advanced Effect Patterns (from NVI implementations)

### Energy Type Conversion Abilities (Dark Aura pattern)
Intercept `CheckProvidedEnergyEffect` to modify what energy types attached cards provide:

```typescript
// Hydreigon's Dark Aura - all basic energy provides Dark
if (effect instanceof CheckProvidedEnergyEffect) {
  const player = effect.player;

  // Verify this card is in play for this player
  let inPlay = false;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
    if (cardList.getPokemonCard() === this) inPlay = true;
  });
  if (!inPlay) return state;

  // Check ability lock
  if (IS_ABILITY_BLOCKED(store, state, player, this)) return state;

  // Only affect player's own Pokemon
  let sourceOwner: any = null;
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
    if (cardList === effect.source) sourceOwner = player;
  });
  if (sourceOwner !== player) return state;

  // Convert all basic energy to provide Dark
  effect.energyMap.forEach(em => {
    if (em.card.energyType === EnergyType.BASIC) {
      em.provides = em.provides.map(() => CardType.DARK);
    }
  });
}
```

**Key insight**: Modify `em.provides` array, not the card itself. This affects energy payment checks without changing the actual cards.

### Weakness/Resistance Modification (Leaf Tailor pattern)
Intercept `CheckPokemonStatsEffect` to modify weakness or resistance:

```typescript
// Leavanny's Leaf Tailor - remove weakness from Pokemon with energy
if (effect instanceof CheckPokemonStatsEffect) {
  // Find owner of this ability
  let owner: any = null;
  state.players.forEach(p => {
    p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      if (cardList.getPokemonCard() === this) owner = p;
    });
  });
  if (!owner || IS_ABILITY_BLOCKED(store, state, owner, this)) return state;

  // Check if target belongs to same player
  let targetOwner: any = null;
  state.players.forEach(p => {
    if (p.active === effect.target || p.bench.includes(effect.target)) {
      targetOwner = p;
    }
  });
  if (targetOwner !== owner) return state;

  // Check if target has energy
  const checkEnergy = new CheckProvidedEnergyEffect(targetOwner, effect.target);
  store.reduceEffect(state, checkEnergy);

  if (checkEnergy.energyMap.length > 0) {
    effect.weakness = [];  // Remove all weaknesses
  }
}
```

### Damage Reflection/Retaliation (Rough Skin pattern)
Use `AfterDamageEffect` to respond when this Pokemon is damaged:

```typescript
// Druddigon's Rough Skin - damage attacker when hit
if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
  const player = effect.player;  // Attacker
  const targetPlayer = StateUtils.findOwner(state, effect.target);

  // Conditions: was damaged, by opponent, while active, during attack phase
  if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
    return state;
  }
  if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) return state;
  if (state.phase !== GamePhase.ATTACK) return state;

  // Damage the attacker
  effect.source.damage += 20;  // 2 damage counters
}
```

**Gotcha**: Check `state.phase !== GamePhase.ATTACK` to avoid triggering on non-attack damage (poison, effects, etc.)

### Energy Discard on Damage (Cursed Body pattern)
Similar to Rough Skin but discards attacker's energy:

```typescript
// When prompted for energy choice, the DEFENDER (targetPlayer) chooses
return store.prompt(state, new ChooseCardsPrompt(
  targetPlayer,  // Defender chooses which energy to discard
  GameMessage.CHOOSE_CARD_TO_DISCARD,
  attacker,      // From the attacker's cards
  { superType: SuperType.ENERGY },
  { min: 1, max: 1, allowCancel: false }
), selected => {
  if (selected && selected.length > 0) {
    attacker.moveCardTo(selected[0], player.discard);  // Goes to attacker's discard
  }
});
```

### Marker Cleanup on Opponent's Turn
For effects that last "during your next turn", remove markers at end of OPPONENT's turn:

```typescript
// Virizion's Leaf Wallop - bonus damage on consecutive use
if (effect instanceof EndTurnEffect) {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Remove marker from opponent's Pokemon (this card) when their turn ends
  opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
    if (cardList.getPokemonCard() === this) {
      REMOVE_MARKER(this.LEAF_WALLOP_MARKER, cardList, this);
    }
  });
}
```

**Key insight**: `EndTurnEffect.player` is the player whose turn is ending. To remove markers after opponent's turn, check `opponent.forEachPokemon`.

### Conditional Evolution Search (Mysterious Evolution pattern)
Search for evolution only if another specific Pokemon is in play:

```typescript
// Check if required Pokemon is anywhere in play (either player)
let requiredPokemonInPlay = false;
state.players.forEach(p => {
  p.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    if (cardList.getPokemonCard()?.name === 'Shelmet') {
      requiredPokemonInPlay = true;
    }
  });
  p.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
    if (cardList.getPokemonCard()?.name === 'Shelmet') {
      requiredPokemonInPlay = true;
    }
  });
});

if (!requiredPokemonInPlay) return state;

// Build blocked list for evolution search
const blocked: number[] = [];
player.deck.cards.forEach((card, index) => {
  if (!(card instanceof PokemonCard) || card.evolvesFrom !== 'Karrablast') {
    blocked.push(index);
  }
});

// Execute evolution
return store.prompt(state, new ChooseCardsPrompt(
  player,
  GameMessage.CHOOSE_CARD_TO_EVOLVE,
  player.deck,
  { superType: SuperType.POKEMON },
  { min: 0, max: 1, allowCancel: true, blocked }
), cards => {
  if (cards && cards.length > 0) {
    const evolutionCard = cards[0] as PokemonCard;
    player.deck.moveCardTo(evolutionCard, player.active);
    player.active.clearEffects();
    player.active.pokemonPlayedTurn = state.turn;  // Can't evolve again this turn
  }
  SHUFFLE_DECK(store, state, player);
});
```

### Force End Turn (Prize Manipulation)
Some abilities end your turn immediately:

```typescript
// End the turn after ability effect
state.phase = require('../../game/store/state/state').GamePhase.BETWEEN_TURNS;
```

**Warning**: Use sparingly. Make sure all effect logic completes BEFORE setting this.

### Self-Shuffle Attack (Deck and Cover pattern)
Move this Pokemon and all attached cards to deck:

```typescript
// Shuffle this Pokemon and all attached cards into deck
const cardList = player.active;
const cardsToShuffle = cardList.cards.slice();  // Copy array
cardsToShuffle.forEach(card => {
  cardList.moveCardTo(card, player.deck);
});
cardList.clearEffects();

return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
  player.deck.applyOrder(order);
});
```

**Gotcha**: This leaves the active slot empty. The game should handle promoting a benched Pokemon, but test this interaction.

### Damage Counter Movement (Multi-Prompt pattern)
For effects that move damage counters between Pokemon:

```typescript
// First prompt: choose source Pokemon
return store.prompt(state, new ChoosePokemonPrompt(
  player.id,
  GameMessage.CHOOSE_POKEMON,
  PlayerType.BOTTOM_PLAYER,
  [SlotType.ACTIVE, SlotType.BENCH],
  { allowCancel: true }
), sourceTargets => {
  if (!sourceTargets || sourceTargets.length === 0) return;

  const source = sourceTargets[0];
  const maxCounters = Math.min(3, Math.floor(source.damage / 10));

  // Second prompt: choose target Pokemon
  store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
    PlayerType.TOP_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { allowCancel: true }
  ), targetTargets => {
    if (!targetTargets || targetTargets.length === 0) return;

    const target = targetTargets[0];
    const damageToMove = maxCounters * 10;
    source.damage -= damageToMove;
    target.damage += damageToMove;
  });
});
```
