import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../../game';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Geo Storm',
      cost: [P, P, P],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each [P] Energy attached to all of your Pokémon.',
    },
  ];

  public regulationMark: string = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Xerneas';
  public fullName: string = 'Xerneas M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let psychicEnergyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkEnergy);
        checkEnergy.energyMap.forEach((em) => {
          em.provides.forEach((t) => {
            if (t === CardType.PSYCHIC || t === CardType.ANY) {
              psychicEnergyCount++;
            }
          });
        });
      });

      effect.damage = 30 * psychicEnergyCount;
    }

    return state;
  }
}
