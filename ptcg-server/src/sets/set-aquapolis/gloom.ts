import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Oddish';
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Enervating Pollen',
    powerType: PowerType.POKEBODY,
    text: 'As long as Gloom is in play, Resistance on each player\'s Active Pokémon only reduces damage by 10.'
  }];

  public attacks = [{
    name: 'Sleep Sap',
    cost: [C, C],
    damage: 20,
    text: 'Both the Defending Pokémon and Gloom are now Asleep (after doing damage).'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Gloom';
  public fullName: string = 'Gloom AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);

      // Gloom is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const target = effect.target.getPokemonCard();
      if (target && Array.isArray(target.resistance)) {
        // Set each resistance value to -10
        effect.resistance = target.resistance.map(res => {
          if (typeof res.value === 'number') {
            return {
              ...res,
              value: -10
            };
          }
          return res;
        });
      }
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}