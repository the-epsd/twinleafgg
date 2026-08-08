import { State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Exeggutor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Exeggcute';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Barrage O\'Clock',
    cost: [G],
    damage: 60,
    damageCalculation: 'x',
    text: 'Flip a coin for each Energy attached to both Active Pokémon. This attack does 60 damage for each heads.'
  }];

  public set: string = 'SSP';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Exeggutor';
  public fullName: string = 'Exeggutor SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const opponentsEnergyCount = checkProvidedEnergyEffect.energyMap.reduce(
        (left, p) => left + p.provides.length, 0
      );

      const checkMyProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkMyProvidedEnergyEffect);
      const myEnergyCount = checkMyProvidedEnergyEffect.energyMap.reduce(
        (left, p) => left + p.provides.length, 0
      );

      const coinCount = opponentsEnergyCount + myEnergyCount;
      if (coinCount === 0) {
        effect.damage = 0;
        return state;
      }

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, coinCount, result => {
        let heads = 0;
        result.forEach(r => {
          heads += r ? 1 : 0;
        });

        effect.damage = 60 * heads;
      });
    }

    return state;
  }
}
