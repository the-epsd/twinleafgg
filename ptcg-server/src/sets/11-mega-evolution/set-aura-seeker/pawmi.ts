import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Pawmi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Quick Draw',
    cost: [L, L],
    damage: 30,
    text: 'Draw a card from your deck.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'M7';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Pawmi';
  public fullName: string = 'Pawmi FLO';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Quick Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    return state;
  }
}
