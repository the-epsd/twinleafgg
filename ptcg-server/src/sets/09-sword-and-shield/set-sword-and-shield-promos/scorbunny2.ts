import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../../game/store/prefabs/prefabs';

export class Scorbunny2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flaring Dash',
    cost: [R],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, draw a card.'
  }, {
    name: 'Flare',
    cost: [R, C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';

  public set = 'SWSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '244';
  public name = 'Scorbunny';
  public fullName = 'Scorbunny SWSH 244';

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