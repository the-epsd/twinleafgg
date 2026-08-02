import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #26 — Peer At */
export class Pikachu26 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Peer At',
    cost: [C],
    damage: 0,
    text: 'Your opponent reveals their hand.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 26';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Peer At
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.hand.cards.length > 0) {
        SHOW_CARDS_TO_PLAYER(store, state, effect.player, opponent.hand.cards);
      }
    }
    return state;
  }
}
