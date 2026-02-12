import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND } from '../../game/store/prefabs/attack-effects';

export class Tropius extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Return',
      cost: [G],
      damage: 10,
      text: 'Draw cards until you have 6 cards in your hand.'
    },
    {
      name: 'Energy Press',
      cost: [G, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'Does 20 more damage for each Energy attached to the Defending Pok\u00e9mon.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(6, effect, state);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
      effect.damage += 20 * energyCount;
    }

    return state;
  }
}
