import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_TOP_X_CARDS_FROM_YOUR_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Gible extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [N];
  public weakness = [];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Dragon Pulse',
    cost: [W, F],
    damage: 40,
    text: 'Discard the top card of your deck.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Gible';
  public fullName: string = 'Gible FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dragon Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, effect.player, 1, this, effect);
    }

    return state;
  }
}
