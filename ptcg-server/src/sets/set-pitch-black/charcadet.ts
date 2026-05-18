import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Charcadet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Best Punch',
    cost: [R],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing.',
  }];

  public set: string = 'M5';
  public setNumber: string = '10';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charcadet';
  public fullName: string = 'Charcadet M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}
