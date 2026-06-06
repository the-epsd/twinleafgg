# Real Card Examples

Complete implementations demonstrating common patterns.

---

## Example 1: Miraidon ex (Ability + Attack with Self-Lock)

**Patterns demonstrated:**
- Once-per-turn ability using markers
- "Can't attack next turn" self-restriction
- Search deck and put onto bench

```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import {
  WAS_ATTACK_USED, WAS_POWER_USED, BLOCK_IF_DECK_EMPTY,
  GET_PLAYER_BENCH_SLOTS, BLOCK_IF_NO_SLOTS, SHUFFLE_DECK
} from '../../game/store/prefabs/prefabs';

export class Miraidonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage = Stage.BASIC;
  public cardType = L;
  public hp = 220;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Tandem Unit',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up to 2 Basic Lightning Pokemon and put them onto your Bench.'
  }];

  public attacks = [{
    name: 'Photon Blaster',
    cost: [L, L, C],
    damage: 220,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];

  public set = 'SVI';
  public setNumber = '081';
  public regulationMark = 'G';
  public cardImage = 'assets/cardback.png';
  public name = 'Miraidon ex';
  public fullName = 'Miraidon ex SVI';

  public readonly TANDEM_UNIT_MARKER = 'TANDEM_UNIT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TANDEM_UNIT_MARKER, this);
    }

    // Attack: Can't attack next turn (use built-in system)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.cannotAttackNextTurnPending = true;
    }

    // Ability: Once per turn, search for Basic Lightning Pokemon
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if already used this turn
      if (player.marker.hasMarker(this.TANDEM_UNIT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Validation checks
      BLOCK_IF_DECK_EMPTY(player);
      const slots = GET_PLAYER_BENCH_SLOTS(player);
      BLOCK_IF_NO_SLOTS(slots);

      // Mark as used
      player.marker.addMarker(this.TANDEM_UNIT_MARKER, this);

      // Search and put onto bench
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: CardType.LIGHTNING },
        { min: 0, max: Math.min(2, slots.length), allowCancel: false }
      ), cards => {
        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
```

---

## Example 2: Gardevoir ex (Repeatable Ability from Discard)

**Patterns demonstrated:**
- "As often as you like" ability (no marker needed)
- Attach energy from discard
- Self-damage as cost
- HP check to prevent KO

```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';

export class Gardevoirex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage = Stage.STAGE_2;
  public evolvesFrom = 'Kirlia';
  public cardType = P;
  public hp = 310;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Psychic Embrace',
    powerType: PowerType.ABILITY,
    text: 'As often as you like during your turn, you may attach a Basic Psychic Energy from your discard pile to 1 of your Psychic Pokemon. If you attached Energy in this way, put 2 damage counters on that Pokemon.'
  }];

  public attacks = [{
    name: 'Miracle Force',
    cost: [P, P, C],
    damage: 190,
    text: 'This Pokemon recovers from all Special Conditions.'
  }];

  public set = 'SVI';
  public setNumber = '086';
  public regulationMark = 'G';
  public cardImage = 'assets/cardback.png';
  public name = 'Gardevoir ex';
  public fullName = 'Gardevoir ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ability: Psychic Embrace - repeatable, attach Psychic energy with self-damage
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check for Psychic energy in discard
      const hasPsychicEnergy = player.discard.cards.some(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.PSYCHIC)
      );

      if (!hasPsychicEnergy) {
        throw new GameError(GameMessage.NO_CARDS_IN_DISCARD);
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Psychic Energy' },
        { allowCancel: true, min: 0, max: 1 }
      ), transfers => {
        if (!transfers || transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const pokemonCard = target.getPokemonCard();

          // Must be Psychic Pokemon
          if (pokemonCard?.cardType !== CardType.PSYCHIC) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }

          // Check if would KO (can't use if it would KO)
          const checkHp = new CheckHpEffect(player, target);
          store.reduceEffect(state, checkHp);
          if (target.damage + 20 >= checkHp.hp) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          // Execute: attach energy and deal self-damage
          player.discard.moveCardTo(transfer.card, target);
          target.damage += 20;
        }
      });
    }

    return state;
  }
}
```

---

## Example 3: Arven (Supporter with Generator Pattern)

**Patterns demonstrated:**
- Generator function for multi-step prompts
- Search with complex filtering (1 Item + 1 Tool)
- Show to opponent, then shuffle

```typescript
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class Arven extends TrainerCard {
  public trainerType = TrainerType.SUPPORTER;
  public regulationMark = 'G';
  public set = 'SVI';
  public setNumber = '166';
  public cardImage = 'assets/cardback.png';
  public name = 'Arven';
  public fullName = 'Arven SVI';
  public text = 'Search your deck for an Item card and a Pokemon Tool card, reveal them, and put them into your hand. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}

function* playCard(
  next: Function,
  store: StoreLike,
  state: State,
  self: Arven,
  effect: TrainerEffect
): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // Move to supporter zone, prevent default discard
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  effect.preventDefault = true;

  // Build blocked list - only Items and Tools allowed
  const blocked: number[] = [];
  player.deck.cards.forEach((c, index) => {
    if (!(c instanceof TrainerCard) ||
        (c.trainerType !== TrainerType.TOOL && c.trainerType !== TrainerType.ITEM)) {
      blocked.push(index);
    }
  });

  let cards: Card[] = [];

  // Prompt for cards (max 1 item + 1 tool)
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_ONE_ITEM_AND_ONE_TOOL_TO_HAND,
    player.deck,
    {},
    { min: 0, max: 2, allowCancel: false, blocked, maxTools: 1, maxItems: 1 }
  ), selected => {
    cards = selected || [];
    next();
  });

  // Move cards to hand
  player.deck.moveCardsTo(cards, player.hand);

  // Move supporter to discard
  player.supporter.moveCardTo(effect.trainerCard, player.discard);

  // Show cards to opponent
  if (cards.length > 0) {
    yield store.prompt(state, new ShowCardsPrompt(
      opponent.id,
      GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
      cards
    ), () => next());
  }

  // Shuffle deck
  return SHUFFLE_DECK(store, state, player);
}
```

---

## Example 4: Post-Damage Switching (Metal Horns Pattern)

**Patterns demonstrated:**
- AfterAttackEffect for post-damage effects
- Boolean flag to track attack usage
- Proper cleanup at end of turn

```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Cobalion extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = M;
  public hp = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Metal Horns',
      cost: [M, C],
      damage: 30,
      text: 'Your opponent switches the Defending Pokemon with 1 of their Benched Pokemon.'
    },
    {
      name: 'Sacred Sword',
      cost: [M, M, C],
      damage: 100,
      text: 'This Pokemon can\'t use Sacred Sword during your next turn.'
    }
  ];

  public set = 'EPO';
  public setNumber = '77';
  public cardImage = 'assets/cardback.png';
  public name = 'Cobalion';
  public fullName = 'Cobalion EPO';

  // Flag to track Metal Horns usage
  public usedMetalHorns = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Metal Horns - set flag when attack is used
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedMetalHorns = true;
    }

    // Metal Horns - switch happens AFTER damage
    if (effect instanceof AfterAttackEffect && this.usedMetalHorns) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      // Only switch if opponent has benched Pokemon
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedMetalHorns) {
      this.usedMetalHorns = false;
    }

    // Sacred Sword - self-restriction using built-in system
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Sacred Sword')) {
        player.active.cannotUseAttacksNextTurnPending.push('Sacred Sword');
      }
    }

    return state;
  }
}
```

---

## Example 5: Passive Damage Reduction Ability

**Patterns demonstrated:**
- useWhenInPlay ability (always active)
- Intercepting DealDamageEffect
- Checking ability lock

```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Jolteon extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType = L;
  public hp = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Lightning Shield',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'This Pokemon takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Pin Missile',
    cost: [L, C],
    damage: 30,
    text: 'Flip 4 coins. This attack does 30 damage for each heads.'
  }];

  public set = 'VIV';
  public setNumber = '047';
  public regulationMark = 'E';
  public cardImage = 'assets/cardback.png';
  public name = 'Jolteon';
  public fullName = 'Jolteon VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Passive ability: reduce incoming damage by 30
    if (effect instanceof DealDamageEffect) {
      // Check if this Pokemon is the target
      const dominated = effect.target.getPokemonCard();
      if (dominated !== this) {
        return state;
      }

      // Check if ability is blocked
      const player = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Reduce damage by 30 (minimum 0)
      effect.damage = Math.max(0, effect.damage - 30);
    }

    return state;
  }
}
```

---

## Common Import Patterns

### Pokemon Card
```typescript
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, PowerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, AfterAttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED, DRAW_CARDS, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
```

### Trainer Card
```typescript
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { WAS_TRAINER_USED, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
```

---

## Quick Reference: Effect Patterns by Card

| Effect Pattern | Reference Card | File Path |
|----------------|----------------|-----------|
| Coin flip +damage | Darmanitan EPO | `set-emerging-powers/darmanitan.ts` |
| Multiple coin flips | Scolipede EPO | `set-emerging-powers/scolipede.ts` |
| Flip until tails | Gyarados SF | `set-stormfront/gyarados.ts` |
| Paralysis | Galvantula EPO | `set-emerging-powers/galvantula.ts` |
| Poison | Venipede EPO | `set-emerging-powers/venipede.ts` |
| Burn | Darmanitan EPO | `set-emerging-powers/darmanitan.ts` |
| Sleep | Cubchoo EPO | `set-emerging-powers/cubchoo.ts` |
| Confusion | Klang EPO | `set-emerging-powers/klang.ts` |
| Self-sleep (Rest) | Cubchoo EPO | `set-emerging-powers/cubchoo.ts` |
| Healing (Leech Life) | Virizion EPO | `set-emerging-powers/virizion.ts` |
| Discard energy cost | Simisear EPO | `set-emerging-powers/simisear.ts` |
| Attach from deck | Thundurus EPO | `set-emerging-powers/thundurus.ts` |
| Move opponent energy | Simipour EPO | `set-emerging-powers/simipour.ts` |
| Move own energy (ability) | Blissey ex TWM | `set-twilight-masquerade/blissey-ex.ts` |
| Can't attack next turn | Sawk EPO | `set-emerging-powers/sawk.ts` |
| Can't use specific attack | Cobalion EPO | `set-emerging-powers/cobalion.ts` |
| Force opponent switch | Cobalion EPO | `set-emerging-powers/cobalion.ts` |
| Prevent retreat | Larry's Braviary | `set-mega-dream/set-start-deck-100/larrys-braviary.ts` |
| Self-damage | Larry's Braviary | `set-mega-dream/set-start-deck-100/larrys-braviary.ts` |
| Damage reduction ability | Cloyster FST | `set-fusion-strike/cloyster.ts` |
| Energy movement ability | Aromatisse XY | `set-x-and-y/aromatisse.ts` |
| Between turns heal ability | Serperior BLW | Use `BetweenTurnsEffect` pattern |
| Self-damage (recoil) | Zekrom BLW | `set-black-and-white/zekrom.ts` |
| Increased poison (20 dmg) | Scolipede EPO | `set-emerging-powers/scolipede.ts` |
| **Energy type conversion** | Hydreigon NVI | `set-noble-victories/hydreigon.ts` |
| **Weakness removal** | Leavanny NVI | `set-noble-victories/leavanny.ts` |
| **Damage reflection** | Druddigon NVI | `set-noble-victories/druddigon.ts` |
| **Energy discard on damage** | Jellicent NVI | `set-noble-victories/jellicent.ts` |
| **Conditional evolution** | Karrablast/Shelmet NVI | `set-noble-victories/karrablast.ts` |
| **Next turn bonus damage** | Virizion NVI | `set-noble-victories/virizion.ts` |
| **Self-shuffle to deck** | Accelgor NVI | `set-noble-victories/accelgor.ts` |
| **Move damage counters** | Cofagrigus NVI | `set-noble-victories/cofagrigus.ts` |
| **Prize manipulation** | Cofagrigus NVI 47 | `set-noble-victories/cofagrigus-2.ts` |
| **Attach energy from discard** | Volcarona NVI | `set-noble-victories/volcarona.ts` |

---

## NVI Pattern Examples

### Energy Type Conversion (Hydreigon - Dark Aura)

Modifies what energy types attached cards provide without changing the cards themselves.

**Key file:** `set-noble-victories/hydreigon.ts`

```typescript
// Intercept CheckProvidedEnergyEffect to convert energy types
if (effect instanceof CheckProvidedEnergyEffect) {
  // ... ownership and ability lock checks ...

  effect.energyMap.forEach(em => {
    if (em.card.energyType === EnergyType.BASIC) {
      em.provides = em.provides.map(() => CardType.DARK);
    }
  });
}
```

### Damage Reflection (Druddigon - Rough Skin)

Deals damage back to attacker when this Pokemon is hit.

**Key file:** `set-noble-victories/druddigon.ts`

```typescript
if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)) {
  // Validate: was damaged, by opponent, while active, during attack phase
  if (effect.damage <= 0) return state;
  if (player === targetPlayer) return state;  // Not self-damage
  if (targetPlayer.active !== effect.target) return state;  // Must be active
  if (state.phase !== GamePhase.ATTACK) return state;  // Only during attacks

  effect.source.damage += 20;  // Damage the attacker
}
```

### Conditional Evolution (Karrablast - Mysterious Evolution)

Searches for evolution only when a partner Pokemon is in play.

**Key file:** `set-noble-victories/karrablast.ts`

```typescript
// Check BOTH players for the required Pokemon
state.players.forEach(p => {
  p.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    if (cardList.getPokemonCard()?.name === 'Shelmet') {
      shelmetInPlay = true;
    }
  });
  p.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
    if (cardList.getPokemonCard()?.name === 'Shelmet') {
      shelmetInPlay = true;
    }
  });
});

// Use blocked array to restrict search to valid evolutions
const blocked: number[] = [];
player.deck.cards.forEach((card, index) => {
  if (!(card instanceof PokemonCard) || card.evolvesFrom !== 'Karrablast') {
    blocked.push(index);
  }
});
```

### Next Turn Bonus Damage (Virizion - Leaf Wallop)

Uses markers to track that an attack was used and provides bonus damage on next use.

**Key file:** `set-noble-victories/virizion.ts`

```typescript
public readonly LEAF_WALLOP_MARKER = 'LEAF_WALLOP_MARKER';

// Check for existing marker and add bonus
if (HAS_MARKER(this.LEAF_WALLOP_MARKER, cardList, this)) {
  effect.damage += 40;
}

// Add marker for next turn
ADD_MARKER(this.LEAF_WALLOP_MARKER, cardList, this);

// Remove marker at end of OPPONENT'S turn
if (effect instanceof EndTurnEffect) {
  const opponent = StateUtils.getOpponent(state, player);
  opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
    if (cardList.getPokemonCard() === this) {
      REMOVE_MARKER(this.LEAF_WALLOP_MARKER, cardList, this);
    }
  });
}
```

### Self-Shuffle Attack (Accelgor - Deck and Cover)

Shuffles the attacking Pokemon and all attached cards into the deck.

**Key file:** `set-noble-victories/accelgor.ts`

```typescript
// Apply special conditions first
const addSpecialCondition = new AddSpecialConditionsEffect(effect, [
  SpecialCondition.PARALYZED,
  SpecialCondition.POISONED
]);
store.reduceEffect(state, addSpecialCondition);

// Then shuffle self into deck
const cardList = player.active;
const cardsToShuffle = cardList.cards.slice();  // Copy the array!
cardsToShuffle.forEach(card => {
  cardList.moveCardTo(card, player.deck);
});
cardList.clearEffects();

return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
  player.deck.applyOrder(order);
});
```
