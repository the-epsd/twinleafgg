import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Weedle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [G],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Weedle';
  public fullName: string = 'Weedle M4';

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
