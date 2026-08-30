import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Voltorbex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 170;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hundred-Hitting Ball',
      cost: [C, C, C],
      damage: 100,
      damageCalculation: '+',
      text: 'Flip a coin until you get tails. This attack does 100 more damage for each heads.',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Voltorb ex';
  public fullName: string = 'Voltorb ex ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hundred-Hitting Ball
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_MORE_DAMAGE_PER_HEADS(store, state, effect, 100);
    }

    return state;
  }
}
