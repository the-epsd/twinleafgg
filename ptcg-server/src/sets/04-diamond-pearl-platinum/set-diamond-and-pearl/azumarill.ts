import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Marill';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: 20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Defense Curl',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to Azumarill during your opponent\'s next turn.'
  },
  {
    name: 'Bubble Pump',
    cost: [W, W],
    damage: 40,
    damageCalculation: '+',
    text: 'If Azumarill has 3 or more Energy attached to it, this attack does 40 damage plus 20 more damage. If Azurill is anywhere under Azumarill, flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Azumarill';
  public fullName: string = 'Azumarill DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Defense Curl
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    // Bubble Pump
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((sum, e) => sum + e.provides.length, 0);
      if (energyCount >= 3) {
        effect.damage += 20;
      }

      const hasAzurill = player.active.cards.some(c => c.name === 'Azurill');
      if (hasAzurill) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
          }
        });
      }
    }

    return state;
  }
}
