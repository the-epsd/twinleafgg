# State Classes Reference

This document covers the key state classes used in card implementations.

---

## PokemonCardList Properties

`PokemonCardList` represents a Pokemon slot (active or bench) and all its state.

Location: `ptcg-server/src/game/store/state/pokemon-card-list.ts`

### Core Properties
```typescript
cards: Card[]              // All cards in this slot (Pokemon stack + energies + tools)
damage: number = 0         // Current damage on this Pokemon (in HP, not counters)
poisonDamage: number = 10  // Damage dealt by poison between turns (default 10)
burnDamage: number = 20    // Damage dealt by burn between turns (default 20)
sleepFlips: number = 1     // Number of coin flips to wake up (default 1)
```

### Special Conditions
```typescript
specialConditions: SpecialCondition[] = []  // Active special conditions (PARALYZED, CONFUSED, etc.)

// Check/modify conditions:
pokemonList.specialConditions.includes(SpecialCondition.PARALYZED)
pokemonList.specialConditions.push(SpecialCondition.ASLEEP)
```

### Turn Tracking
```typescript
pokemonPlayedTurn: number = 0   // Turn this Pokemon was played/benched
movedToActiveThisTurn: boolean  // Whether this moved to active this turn
```

### Attack Restrictions (IMPORTANT!)
```typescript
// === SELF-RESTRICTION (this Pokemon can't attack/use X next turn) ===
cannotAttackNextTurn: boolean = false           // Can't use ANY attack next turn
cannotAttackNextTurnPending: boolean = false    // Will become cannotAttackNextTurn at end of turn

cannotUseAttacksNextTurn: string[] = []         // Specific attacks this Pokemon can't use
cannotUseAttacksNextTurnPending: string[] = []  // Will become cannotUseAttacksNextTurn at end of turn

// Usage: "This Pokemon can't use [Attack Name] during your next turn"
if (WAS_ATTACK_USED(effect, 0, this)) {
  if (!player.active.cannotUseAttacksNextTurnPending.includes('Sacred Sword')) {
    player.active.cannotUseAttacksNextTurnPending.push('Sacred Sword');
  }
}
// The system handles the transfer from Pending to Active automatically!
```

### Tool Slots
```typescript
tools: Card[] = []         // Attached Pokemon Tools
toolCount: number = 1      // Max tools allowed (usually 1, some Pokemon allow more)
```

### Markers
```typescript
marker = new Marker()      // Per-Pokemon marker storage

// Usage:
pokemonList.marker.addMarker('MY_MARKER', this);
pokemonList.marker.hasMarker('MY_MARKER', this);
pokemonList.marker.removeMarker('MY_MARKER', this);
```

### Key Methods
```typescript
// Get the top Pokemon card (the active Pokemon itself)
getPokemonCard(): PokemonCard | undefined

// Get all Pokemon in the evolution stack
getPokemons(): PokemonCard[]

// Get all basic energy cards attached
getBasicEnergyCards(): EnergyCard[]

// Check if this is a V Pokemon
vPokemon(): boolean

// Clear all attack effects (used when switching)
clearEffects(): void
```

---

## Player Properties

`Player` represents one player's complete game state.

Location: `ptcg-server/src/game/store/state/player.ts`

### Identification
```typescript
id: number = 0             // Player ID
name: string = ''          // Player name
deckId?: number            // Deck ID
avatarName: string = ''    // Avatar name
```

### Card Zones
```typescript
deck: CardList             // Draw pile
hand: CardList             // Cards in hand
discard: CardList          // Discard pile
lostzone: CardList         // Lost Zone
stadium: CardList          // Player's stadium slot (shared but tracked per player)
supporter: CardList        // Supporter being played (temporary holding)

active: PokemonCardList    // Active Pokemon slot
bench: PokemonCardList[]   // Bench slots (usually 5)
prizes: CardList[]         // Prize card slots
```

### Turn Tracking
```typescript
supporterTurn: number = 0        // Turn a supporter was last played
ancientSupporter: boolean        // Ancient supporter played this turn
rocketSupporter: boolean         // Rocket supporter played this turn
retreatedTurn: number = 0        // Turn player last retreated
energyPlayedTurn: number = 0     // Turn energy was last attached
stadiumPlayedTurn: number = 0    // Turn stadium was last played
stadiumUsedTurn: number = 0      // Turn stadium effect was last used
```

### Special Mechanics
```typescript
usedVSTAR: boolean = false       // VSTAR Power used this game
usedGX: boolean = false          // GX attack used this game
legacyEnergyUsed: boolean        // Legacy energy attached this turn
canEvolve: boolean = false       // Can evolve Pokemon this turn (abilities)
showAllStageAbilities: boolean   // Show abilities from all evolution stages
```

### Prize Tracking
```typescript
prizesTaken: number = 0          // Total prizes taken this game
prizesTakenThisTurn: number = 0  // Prizes taken this turn
prizesTakenLastTurn: number = 0  // Prizes taken last turn

getPrizeLeft(): number           // Get remaining prize count
```

### Movement Tracking
```typescript
movedToActiveThisTurn: number[] = []  // Card IDs that moved to active this turn
```

### Player-Level Markers (Important!)
```typescript
marker = new Marker()      // Player-level marker storage

// These are READ-ONLY constants for common markers:
DAMAGE_DEALT_MARKER
ATTACK_USED_MARKER
ATTACK_USED_2_MARKER
KNOCKOUT_MARKER
CLEAR_KNOCKOUT_MARKER
OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER
DEFENDING_POKEMON_CANNOT_RETREAT_MARKER
PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER
DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER
DEFENDING_POKEMON_CANNOT_ATTACK_MARKER
// ... and more (see player.ts for full list)
```

### Attack Effect Locks (opponent-applied)
```typescript
// These lock the OPPONENT from playing certain cards
ATTACK_EFFECT_SUPPORTER_LOCK    // Opponent can't play Supporters
ATTACK_EFFECT_ITEM_LOCK         // Opponent can't play Items
ATTACK_EFFECT_TOOL_LOCK         // Opponent can't play Tools
ATTACK_EFFECT_STADIUM_LOCK      // Opponent can't play Stadiums
ATTACK_EFFECT_SPECIAL_ENERGY_LOCK // Opponent can't attach Special Energy
```

### Key Methods
```typescript
// Iterate over all Pokemon in play
forEachPokemon(playerType, handler): void
// handler receives: (cardList: PokemonCardList, pokemonCard: PokemonCard, target: CardTarget)

// Get all Pokemon slots that have Pokemon
getPokemonInPlay(): PokemonCardList[]

// Check if player has V Pokemon in play
vPokemon(): boolean

// Check battle style Pokemon
singleStrike(): boolean
fusionStrike(): boolean
rapidStrike(): boolean

// Get a specific slot by type
getSlot(slotType: SlotType): CardList

// Switch active with a benched Pokemon (handles marker cleanup)
switchPokemon(target: PokemonCardList): void

// Remove all effects from a Pokemon (used on KO/switch)
removePokemonEffects(target: PokemonCardList): void
```

---

## StateUtils Methods

`StateUtils` provides helper methods for working with game state.

Location: `ptcg-server/src/game/store/state-utils.ts`

### Player Lookup
```typescript
// Get player by their ID
StateUtils.getPlayerById(state, playerId): Player

// Get the opponent of a player
StateUtils.getOpponent(state, player): Player
```

### Card/Slot Lookup
```typescript
// Get PokemonCardList from a CardTarget
StateUtils.getTarget(state, player, target): PokemonCardList

// Find which CardList contains a card
StateUtils.findCardList(state, card): CardList

// Find which Pokemon slot a card is attached to
StateUtils.findPokemonSlot(state, card): PokemonCardList | undefined

// Find the player who owns a CardList
StateUtils.findOwner(state, cardList): Player

// Check if a PokemonCard is in play
StateUtils.isPokemonInPlay(player, pokemon, location?): boolean
```

### Stadium
```typescript
// Get the stadium card currently in play (if any)
StateUtils.getStadiumCard(state): Card | undefined
```

### Energy Validation
```typescript
// Check if energy meets cost requirements
StateUtils.checkEnoughEnergy(energy: EnergyMap[], cost: CardType[]): boolean

// Check if energy EXACTLY meets cost (no excess)
StateUtils.checkExactEnergy(energy: EnergyMap[], cost: CardType[]): boolean
```

---

## When to Use Player Markers vs Pokemon Markers

### Use Pokemon Markers (`pokemonList.marker`) for:
- Effects tied to a specific Pokemon
- Effects that should be removed when that Pokemon leaves play
- "This Pokemon can't be affected by..." effects
- Per-Pokemon tracking (like "this Pokemon used X")

```typescript
// Example: Track that THIS specific Pokemon used an ability
target.marker.addMarker('USED_ABILITY', this);
```

### Use Player Markers (`player.marker`) for:
- Effects tied to the player, not a specific Pokemon
- "During your opponent's next turn..." effects
- Turn-based effects that persist across Pokemon switches
- Global effects (like "your opponent can't play Items")

```typescript
// Example: Block opponent from playing Items
const opponent = StateUtils.getOpponent(state, player);
opponent.marker.addMarker(player.ATTACK_EFFECT_ITEM_LOCK, this);
```

### Common Pattern: "During opponent's next turn" Effects
These typically use BOTH player markers (to track the effect is active) and Pokemon markers (to track which Pokemon to apply it to):

```typescript
// On attack
opponent.marker.addMarker(player.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
opponent.active.marker.addMarker('PREVENT_DAMAGE_TARGET', this);

// On check (in a global effect handler)
if (player.marker.hasMarker(opponent.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
  if (effect.target.marker.hasMarker('PREVENT_DAMAGE_TARGET', this)) {
    effect.damage = 0;
  }
}

// Cleanup at end of opponent's turn
CLEAR_MARKER_AND_OPPONENTS_POKEMON_MARKER_AT_END_OF_TURN(
  state, effect,
  player.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER,
  'PREVENT_DAMAGE_TARGET',
  this
);
```
