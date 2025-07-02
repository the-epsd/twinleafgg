import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Leafeon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Energy Crush',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the amount of Energy attached to all of your opponent\'s Pokémon.'
  },
  {
    name: 'Leaf Blade',
    cost: [G, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Leafeon';
  public fullName: string = 'Leafeon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Crush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, cardList);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(energy => {
          energies++;
        });
      });

      effect.damage = energies * 20;
    }

    // Leaf Blade
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}