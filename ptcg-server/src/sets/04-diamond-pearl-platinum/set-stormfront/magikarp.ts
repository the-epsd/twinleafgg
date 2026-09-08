import { State, StoreLike } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../../game/store/prefabs/prefabs';

export class Magikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 30;
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sea Spray',
    cost: [],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, draw a card.'
  }, {
    name: 'Splash',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'SF';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magikarp';
  public fullName: string = 'Magikarp SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, player, heads => {
        DRAW_CARDS(store, state, player, heads);
      });
    }
    return state;
  }
}