import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Thunderwave',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Bouncing Ball',
      cost: [L, C],
      damage: 30,
      text: 'Voltorb does 10 damage to itself.'
    },
  ];

  public set: string = 'LM';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }

}
