import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Metang extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Beldum';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Psy Bolt',
      cost: [P],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Psypunch',
      cost: [P, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metang';
  public fullName: string = 'Metang PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
