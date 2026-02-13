import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaMeganiumex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Bayleef';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 360;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Giant Bouquet',
    cost: [C, C, C],
    damage: 70,
    damageCalculation: '+',
    text: 'This attack does 50 more damage for each [G] Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Mega Meganium ex';
  public fullName: string = 'Mega Meganium ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let grassEnergyCount = 0;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      grassEnergyCount = checkProvidedEnergy.energyMap.reduce((sum, energy) => {
        return sum + energy.provides.filter(type => type === CardType.GRASS || type === CardType.ANY).length;
      }, 0);

      effect.damage = 70 + (50 * grassEnergyCount);
    }
    return state;
  }
}