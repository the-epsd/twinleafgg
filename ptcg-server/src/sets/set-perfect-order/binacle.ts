import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class Binacle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Double Draw',
    cost: [F],
    damage: 0,
    text: 'Draw 2 cards.'
  },
  {
    name: 'Scratch',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Binacle';
  public fullName: string = 'Binacle M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(player, 2);
      return state;
    }
    return state;
  }
}