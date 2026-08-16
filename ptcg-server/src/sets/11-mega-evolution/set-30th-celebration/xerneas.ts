import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 120;
  public cardType: CardType = P;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Geonavigation',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Stadium cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Aurora Horns',
    cost: [P, P, C],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Xerneas';
  public fullName: string = 'Xerneas 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Geonavigation
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof TrainerCard && card.trainerType === TrainerType.STADIUM)) {
          blocked.push(index);
        }
      });
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store, state, player, this,
        { superType: SuperType.TRAINER },
        { min: 0, max: 2, allowCancel: false, blocked }
      );
    }

    return state;
  }
}
