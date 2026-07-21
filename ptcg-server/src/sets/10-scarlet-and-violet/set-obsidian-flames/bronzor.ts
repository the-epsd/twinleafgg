import { PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mirror Draw',
    cost: [M],
    damage: 0,
    text: 'Draw cards until you have the same number of cards in your hand as your opponent.',
  },
  {
    name: 'Speed Dive',
    cost: [M, M],
    damage: 30,
    text: '',
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mirror Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, opponent.hand.cards.length);
    }

    return state;
  }
}