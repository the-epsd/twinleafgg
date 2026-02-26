import { State, StoreLike, TrainerCard } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Support',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Tackle',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'PFL';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Piplup';
  public fullName: string = 'Piplup PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      let blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (!(card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER)) {
          blocked.push(index);
        }
      });
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, { superType: SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false, blocked });
    }

    return state;
  }
}