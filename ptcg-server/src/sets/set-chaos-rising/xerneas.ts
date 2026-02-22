import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Geostorm',
    cost: [P, P, P],
    damage: 0,
    damageCalculation: 'x' as 'x',
    text: 'This attack does 30 damage times the number of [P] Energy attached to all of your Pokemon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M4';
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
        checkEnergy.energyMap.forEach(em => {
          em.provides.forEach(t => {
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
