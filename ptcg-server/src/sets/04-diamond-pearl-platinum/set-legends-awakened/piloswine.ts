import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';

export class Piloswine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swinub';
  public hp: number = 100;
  public cardType: CardType[] = [W];
  public weakness = [{ type: M, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Charge Dash',
    cost: [F, C],
    damage: 30,
    damageCalculation: '+',
    text: 'You may do 30 damage plus 30 more damage. If you do, Piloswine does 30 damage to itself.'
  },
  {
    name: 'Icy Wind',
    cost: [W, C, C, C],
    damage: 60,
    text: 'The Defending Pokémon is now Asleep.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Piloswine';
  public fullName: string = 'Piloswine LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charge Dash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 30;
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
        }
      });
    }

    // Icy Wind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
    }

    return state;
  }
}
