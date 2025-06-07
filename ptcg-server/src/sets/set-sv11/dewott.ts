import { PokemonCard, Stage, CardType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dewott extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Oshawott';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Energy Shell',
    cost: [W],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage for each Energy attached to this Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dewott';
  public fullName: string = 'Dewott SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);

      const energyCount = checkProvidedEnergy.energyMap.length;
      effect.damage = 30 * energyCount;
    }
    return state;
  }
}
