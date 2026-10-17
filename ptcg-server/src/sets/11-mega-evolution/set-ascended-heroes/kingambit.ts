import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import {
  IS_ABILITY_BLOCKED,
  THIS_POKEMON_DOES_DAMAGE_TO_ITSELF,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Kingambit extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Bisharp';
  public hp: number = 170;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Supreme Overlord',
    powerType: PowerType.ABILITY,
    text: 'Attacks used by this Pokémon do 30 more damage to your opponent\'s Active Pokémon for each Prize card your opponent has taken (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Double-Edged Slash',
    cost: [M, M],
    damage: 180,
    text: 'This Pokémon also does 50 damage to itself.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '148';
  public name: string = 'Kingambit';
  public fullName: string = 'Kingambit ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Supreme Overlord
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        const opponent = StateUtils.getOpponent(state, player);
        if (effect.target === opponent.active) {
          effect.damage += 30 * opponent.prizesTaken;
        }
      }
    }

    // Double-Edged Slash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 50);
    }

    return state;
  }
}
