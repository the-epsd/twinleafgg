import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tangrowth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tangela';
  public hp: number = 110;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Green Renewal',
    powerType: PowerType.POKEBODY,
    text: 'Remove 1 damage counter from Tangrowth between turns.'
  }];

  public attacks = [{
    name: 'Green Acid',
    cost: [G, C],
    damage: 20,
    text: 'Flip 2 coins. If the first coin is heads, the Defending Pokémon is now Confused. If the second coin is heads, the Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Reaching Vine',
    cost: [G, G, C, C],
    damage: 60,
    text: 'Does 20 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Tangrowth';
  public fullName: string = 'Tangrowth SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Green Renewal
    if (effect instanceof BetweenTurnsEffect) {
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (cardList.damage > 0) {
        store.reduceEffect(state, new HealEffect(owner, cardList, 10));
      }
    }

    // Green Acid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        if (results[0]) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        if (results[1]) {
          ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Reaching Vine
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_X_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state, 2, 2);
    }

    return state;
  }
}
