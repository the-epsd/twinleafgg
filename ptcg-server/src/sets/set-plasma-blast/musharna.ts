import { ADD_CONFUSION_TO_PLAYER_ACTIVE, ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK, DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Musharna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Munna';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Precognitive Dream',
      cost: [P],
      damage: 0,
      text: 'Draw 3 cards. This Pok\u00e9mon is now Asleep.'
    },
    {
      name: 'Psybeam',
      cost: [P, C, C],
      damage: 60,
      text: 'The Defending Pok\u00e9mon is now Confused.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Musharna';
  public fullName: string = 'Musharna PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 3);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, player, this);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
