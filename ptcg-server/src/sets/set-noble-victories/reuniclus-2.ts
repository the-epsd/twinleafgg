import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Reuniclus2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Duosion';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Dizzy Punch',
      cost: [P],
      damage: 30,
      text: ''
    },
    {
      name: 'Mind Bend',
      cost: [P, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Confused.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Reuniclus';
  public fullName: string = 'Reuniclus NVI 53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}
