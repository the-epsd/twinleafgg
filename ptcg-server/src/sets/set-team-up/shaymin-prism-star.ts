import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class ShayminPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.PRISM_STAR];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Flower Storm',
    cost: [G, G],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the amount of basic Energy attached to all of your Pokémon.'
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Shaymin Prism Star';
  public fullName: string = 'Shaymin Prism Star TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let energyCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemon => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, pokemon);
        store.reduceEffect(state, checkProvidedEnergyEffect);

        checkProvidedEnergyEffect.energyMap.forEach(em => {
          if (em.card.energyType === EnergyType.BASIC && em.provides.length > 0) {
            energyCount += em.provides.length;
          }
        });
      });
      // Set the damage based on the total count of basic energy
      effect.damage = 30 * energyCount;

      return state;
    }
    return state;
  }
}