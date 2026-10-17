import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { State, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Noibat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [N];
  public weakness = [];
  public retreat = [C];

  public attacks = [{
    name: 'Knickknack Carrying',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Pokémon Tool card, reveal it, and put it into your hand. Then, shuffle your deck.'
  },
  {
    name: 'Bite',
    cost: [P, D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Noibat';
  public fullName: string = 'Noibat ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Knickknack Carrying
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const filter: Partial<TrainerCard> = {
        superType: SuperType.TRAINER,
        trainerType: TrainerType.TOOL,
      };
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        filter,
        { min: 0, max: 1, allowCancel: true },
      );
    }

    return state;
  }
}
