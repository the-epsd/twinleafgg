import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Galvantula extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [
    {
      name: 'Gnaw',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Stun Needle',
      cost: [L, C],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Galvantula';
  public fullName: string = 'Galvantula EPO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }
    return state;
  }
}
