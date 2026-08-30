import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { State, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [D];
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Lead',
    cost: [D],
    damage: 0,
    text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Darkness Fang',
    cost: [D],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lead
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER } as Partial<TrainerCard>,
        { min: 0, max: 1, allowCancel: true }
      );
    }

    return state;
  }
}
