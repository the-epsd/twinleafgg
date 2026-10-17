import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { State, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Stantler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Lead',
    cost: [],
    damage: 0,
    text: 'Search your deck for a Supporter card, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Frighten Horn',
    cost: [C, C],
    damage: 20,
    text: 'If the Defending Pokémon isn\'t an Evolved Pokémon, that Pokémon is now Confused.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '113';
  public name: string = 'Stantler';
  public fullName: string = 'Stantler SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lead
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        effect.player,
        this,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER } as Partial<TrainerCard>,
        { min: 0, max: 1, allowCancel: true }
      );
    }

    // Frighten Horn
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemons().length <= 1) {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
      }
    }

    return state;
  }
}
