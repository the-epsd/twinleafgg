import { GameError, GameMessage, StateUtils } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Oricorio extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 90;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Captivating Salsa',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon. The new Active Poekmon is now Burned and Confused.'
    },
    {
      name: 'Heat Blast',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'CES';
  public name: string = 'Oricorio';
  public fullName: string = 'Oricorio CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '30';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Ref: set-darkness-ablaze/delcatty.ts (Captivating Tail - gust then special condition)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return GUST_OPPONENT_BENCHED_POKEMON(store, state, player, {
        sourceEffect: effect,
        onSwitched: () => {
          const specialConditionEffect = new AddSpecialConditionsEffect(
            effect, [SpecialCondition.BURNED, SpecialCondition.CONFUSED]
          );
          store.reduceEffect(state, specialConditionEffect);
        },
      });
    }

    return state;
  }

}
