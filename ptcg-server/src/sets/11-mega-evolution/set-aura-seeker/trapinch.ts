import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_TOP_X_OF_OPPONENTS_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Trapinch extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mountain Munch',
    cost: [F, C],
    damage: 20,
    text: 'Discard the top card of your opponent\'s deck.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Trapinch';
  public fullName: string = 'Trapinch FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mountain Munch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, effect.player, 1, this, effect);
    }

    return state;
  }
}
