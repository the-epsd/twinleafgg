# Enums Reference

All enum values used in card implementations.

---

## CardType (Energy Types)

Global shorthand variables are available:
```typescript
G = GRASS, R = FIRE, W = WATER, L = LIGHTNING, P = PSYCHIC
F = FIGHTING, D = DARK, M = METAL, C = COLORLESS, Y = FAIRY, N = DRAGON
```

Full enum (use `CardType.X` in logic, shorthand only in card properties):
```typescript
CardType.GRASS
CardType.FIRE
CardType.WATER
CardType.LIGHTNING
CardType.PSYCHIC
CardType.FIGHTING
CardType.DARK
CardType.METAL
CardType.COLORLESS
CardType.FAIRY
CardType.DRAGON
CardType.NONE      // No type
CardType.ANY       // Matches any type (rainbow energy)
```

---

## CardTag (52 Values)

### Pokemon Variant Types
```typescript
POKEMON_ex = 'ex'              // Modern lowercase ex (SV era) - gives 2 prizes
POKEMON_EX = 'EX'              // Classic EX (XY/BW era) - gives 2 prizes
POKEMON_V = 'V'                // V Pokemon - gives 2 prizes
POKEMON_VMAX = 'VMAX'          // VMAX Pokemon - gives 3 prizes
POKEMON_VSTAR = 'VSTAR'        // VSTAR Pokemon - gives 2 prizes, has VSTAR Power
POKEMON_VUNION = 'VUNION'      // V-UNION Pokemon - 4 cards combine
POKEMON_GX = 'GX'              // GX Pokemon - gives 2 prizes, has GX attack
POKEMON_LV_X = 'Lv.X'          // Level X Pokemon (DP era)
POKEMON_SP = 'SP'              // SP Pokemon (Platinum era)
POKEMON_TERA = 'Tera'          // Tera Pokemon (SV era) - bench damage immunity
```

### Battle Styles (SWSH era)
```typescript
FUSION_STRIKE = 'Fusion Strike'
SINGLE_STRIKE = 'Single Strike'
RAPID_STRIKE = 'Rapid Strike'
```

### Time-Based (SV era)
```typescript
FUTURE = 'Future'              // Future Pokemon/Trainers
ANCIENT = 'Ancient'            // Ancient Pokemon/Trainers
```

### Special Pokemon Categories
```typescript
RADIANT = 'Radiant'            // Radiant Pokemon - 1 per deck
ACE_SPEC = 'Ace Spec'          // Ace Spec trainers - 1 per deck
PRISM_STAR = 'Prism Star'      // Prism Star cards - 1 per deck, go to Lost Zone
STAR = 'Star'                  // Pokemon Star (ex era)
ULTRA_BEAST = 'Ultra Beast'    // Ultra Beast Pokemon
TAG_TEAM = 'Tag Team'          // Tag Team GX - gives 3 prizes
BABY = 'Baby'                  // Baby Pokemon (Neo era)
BREAK = 'Break'                // BREAK Pokemon (XY era)
PRIME = 'Prime'                // Prime Pokemon (HGSS era)
HOLO = 'Holo'                  // Holo rare indicator
LEGEND = 'Legend'              // LEGEND Pokemon (HGSS era) - 2 cards combine
DUAL_LEGEND = 'Dual Legend'    // Dual-type LEGEND
MEGA = 'Mega'                  // Mega Evolution (XY era)
PRIMAL = 'Primal'              // Primal Reversion (OR/AS)
ARCEUS = 'Arceus'              // Arceus cards (Platinum era)
UNOWN = 'Unown'                // Unown cards
DELTA_SPECIES = 'Delta Species' // Delta Species (ex era) - different type
```

### Team Affiliations
```typescript
TEAM_PLASMA = 'Team Plasma'    // Team Plasma (BW era)
TEAM_AQUA = 'Team Aqua'        // Team Aqua (ex era / Double Crisis)
TEAM_MAGMA = 'Team Magma'      // Team Magma (ex era / Double Crisis)
TEAM_FLARE = 'Team Flare'      // Team Flare (XY era)
TEAM_ROCKET = 'Team Rocket\'s' // Team Rocket (modern)
ROCKETS = 'Team Rocket\'s'     // Team Rocket (classic) - alias
```

### Trainer Ownership (Gym/Character Pokemon)
```typescript
DARK = 'Dark'                  // Dark Pokemon (Team Rocket set)
BROCKS = 'Brock\'s'
BLAINES = 'Blaine\'s'
MISTYS = 'Misty\'s'
ERIKAS = 'Erika\'s'
LILLIES = 'Lillie\'s'
NS = 'N\'s'
IONOS = 'Iono\'s'
HOPS = 'Hop\'s'
MARNIES = 'Marnie\'s'
STEVENS = 'Steven\'s'
ETHANS = 'Ethan\'s'
LARRYS = 'Larry\'s'
CYNTHIAS = 'Cynthia\'s'
ARVENS = 'Arven\'s'
AURAS = 'Aura\'s'
HOLONS = 'Holon\'s'            // Holon's Pokemon (ex era)
```

### Trainer Card Types
```typescript
ROCKETS_SECRET_MACHINE = 'Secret Machine'  // Rocket's Secret Machine
TECHNICAL_MACHINE = 'Technical Machine'    // Old-style Technical Machine
```

### Special Rules
```typescript
PLAY_DURING_SETUP = 'Play During Setup'    // Can be played during setup
POKEMON_SV_MEGA = 'Mega'                   // SV era Mega (if different)
VS = 'VS'                                  // Japanese VS Pack promos
```

---

## SpecialCondition

```typescript
PARALYZED   // Can't attack or retreat, clears at end of turn
CONFUSED    // Flip to attack, may hit self for 30
ASLEEP      // Flip between turns to wake
POISONED    // Take damage between turns (default 10)
BURNED      // Flip between turns, 20 damage if tails
```

---

## Stage

```typescript
Stage.BASIC      // Basic Pokemon
Stage.STAGE_1    // Stage 1 (evolves from Basic)
Stage.STAGE_2    // Stage 2 (evolves from Stage 1)
Stage.MEGA       // Mega Evolution
Stage.VMAX       // VMAX Evolution
Stage.VSTAR      // VSTAR Evolution
Stage.RESTORED   // Restored Pokemon (from fossils)
Stage.LEGEND     // LEGEND cards
Stage.BREAK      // BREAK Evolution
Stage.LEVEL_X    // Level X
```

---

## TrainerType

```typescript
TrainerType.ITEM        // Item cards (free to play)
TrainerType.SUPPORTER   // Supporter cards (1 per turn)
TrainerType.STADIUM     // Stadium cards (1 per turn, stays in play)
TrainerType.TOOL        // Pokemon Tools (attach to Pokemon)
```

---

## EnergyType

```typescript
EnergyType.BASIC    // Basic Energy (unlimited in deck)
EnergyType.SPECIAL  // Special Energy (4-per-deck limit)
```

---

## PowerType

```typescript
PowerType.ABILITY        // Modern Ability
PowerType.POKEBODY       // Poke-Body (older)
PowerType.POKEPOWER      // Poke-Power (older)
PowerType.POKEMON_POWER  // Pokemon Power (classic)
PowerType.ANCIENT_TRAIT  // Ancient Trait (XY era)
```

---

## SlotType

```typescript
SlotType.ACTIVE    // Active Pokemon slot
SlotType.BENCH     // Bench slot
SlotType.DECK      // Deck
SlotType.HAND      // Hand
SlotType.DISCARD   // Discard pile
SlotType.LOSTZONE  // Lost Zone
SlotType.STADIUM   // Stadium slot
SlotType.SUPPORTER // Supporter slot (temporary during play)
```

---

## PlayerType

```typescript
PlayerType.BOTTOM_PLAYER  // The player (usually "you")
PlayerType.TOP_PLAYER     // The opponent
```

---

## BoardEffect (Visual Effects)

```typescript
ABILITY_USED        // Visual indicator ability was used
POWER_GLOW          // Glow effect for powers
POWER_NEGATED_GLOW  // Ability is blocked
POWER_RETURN        // Returned power indicator
EVOLVE              // Evolution animation
REVEAL_OPPONENT_HAND // Hand reveal indicator
```

---

## Format

```typescript
STANDARD         // Current standard format
EXPANDED         // Expanded format (BW-on)
UNLIMITED        // All cards legal
GLC              // Gym Leader Challenge (singleton)
RETRO            // Retro formats
RSPK             // RS-PK format
STANDARD_NIGHTLY // Nightly standard updates
```

---

## GameMessage (Common Values)

Import: `import { GameMessage } from '../../game/game-message';`

### Error Messages (throw with GameError)
```typescript
BLOCKED_BY_ABILITY          // "This action is blocked by an ability"
BLOCKED_BY_EFFECT           // "This action is blocked by an effect"
BLOCKED_BY_SPECIAL_CONDITION // "Can't do this with a special condition"
CANNOT_RETREAT              // "This Pokemon can't retreat"
CANNOT_PLAY_THIS_CARD       // "You can't play this card"
CANNOT_USE_POWER            // "You can't use this ability"
CANNOT_USE_ATTACK           // "You can't use this attack"
CANNOT_ATTACK_ON_FIRST_TURN // "Can't attack on first turn going first"
CANNOT_USE_STADIUM          // "You can't use this stadium"
NOT_ENOUGH_ENERGY           // "Not enough energy"
NOT_YOUR_TURN               // "It's not your turn"
NO_CARDS_IN_DECK            // "No cards in deck"
NO_CARDS_IN_DISCARD         // "No cards in discard"
POWER_ALREADY_USED          // "This power was already used this turn"
INVALID_TARGET              // "Invalid target"
INVALID_GAME_STATE          // "Invalid game state"
RETREAT_ALREADY_USED        // "Already retreated this turn"
SUPPORTER_ALREADY_PLAYED    // "Already played a Supporter this turn"
STADIUM_ALREADY_PLAYED      // "Already played a Stadium this turn"
STADIUM_ALREADY_USED        // "Already used a Stadium this turn"
NO_BENCH_SLOTS_AVAILABLE    // "No bench slots available"
ABILITY_BLOCKED             // "Ability is blocked"
CANNOT_EVOLVE               // "Can't evolve this Pokemon"
```

### Prompt Messages (use with prompts)
```typescript
CHOOSE_POKEMON_TO_SWITCH    // "Choose a Pokemon to switch"
CHOOSE_CARD_TO_HAND         // "Choose a card to put into your hand"
CHOOSE_CARD_TO_DISCARD      // "Choose a card to discard"
CHOOSE_CARD_TO_DECK         // "Choose a card to put into deck"
CHOOSE_ENERGIES_TO_DISCARD  // "Choose energy to discard"
CHOOSE_POKEMON_TO_DAMAGE    // "Choose a Pokemon to deal damage to"
CHOOSE_POKEMON_TO_HEAL      // "Choose a Pokemon to heal"
CHOOSE_CARD_TO_PUT_ONTO_BENCH // "Choose a Pokemon to put onto your Bench"
COIN_FLIP                   // "Flip a coin"
CHOOSE_PRIZE_CARD           // "Choose a prize card"
CHOOSE_NEW_ACTIVE_POKEMON   // "Choose your new Active Pokemon"
CARDS_SHOWED_BY_THE_OPPONENT // "Cards shown by opponent"
CHOOSE_CARD_FROM_DISCARD    // "Choose a card from your discard pile"
CHOOSE_CARD_FROM_DECK       // "Choose a card from your deck"
CHOOSE_SPECIAL_CONDITION    // "Choose a Special Condition"
WANT_TO_USE_ABILITY         // "Do you want to use this ability?"
WANT_TO_SWITCH_POKEMON      // "Do you want to switch Pokemon?"
WANT_TO_DRAW_CARDS          // "Do you want to draw cards?"
```

### Log Messages (for game log)
```typescript
// Use with store.log(state, GameLog.X, params)
LOG_PLAYER_DRAWS_CARD       // { name }
LOG_PLAYER_USES_ATTACK      // { name, attack }
LOG_PLAYER_USES_ABILITY     // { name, ability }
LOG_PLAYER_PLAYS_ITEM       // { name, card }
LOG_PLAYER_PLAYS_SUPPORTER  // { name, card }
LOG_PLAYER_PLAYS_STADIUM    // { name, card }
LOG_PLAYER_RETREATS         // { name, active, benched }
LOG_PLAYER_EVOLVES_POKEMON  // { name, card, pokemon }
LOG_PLAYER_DEALS_DAMAGE     // { name, damage, target, effect }
LOG_POKEMON_KO              // { name }
LOG_PLAYER_FLIPS_HEADS      // { name }
LOG_PLAYER_FLIPS_TAILS      // { name }
LOG_PLAYER_DISCARDS_CARD_FROM_HAND // { name, card }
```
