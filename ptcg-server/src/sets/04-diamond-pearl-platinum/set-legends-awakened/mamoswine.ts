import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON, THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Mamoswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Piloswine';
  public hp: number = 140;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +40 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Ice Fang',
    cost: [W, C, C],
    damage: 40,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed and discard an Energy card attached to the Defending Pokémon.'
  },
  {
    name: 'Charge Through',
    cost: [F, C, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may do 60 damage plus 40 more damage and 40 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If you do, Mamoswine does 40 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Mamoswine';
  public fullName: string = 'Mamoswine LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ice Fang
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    // Charge Through
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        effect.damage += 40;
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(40, effect, store, state);
        THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 40);
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
