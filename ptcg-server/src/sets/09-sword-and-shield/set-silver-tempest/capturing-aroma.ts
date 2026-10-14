import { Stage, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  GameError,
  GameMessage,
  State,
  StoreLike,
  TrainerCard,
  Player,
  PokemonCard,
} from '../../../game';
import {
  COIN_FLIP_PROMPT,
  SEARCH_DECK_FOR_CARDS_TO_HAND,
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CapturingAroma extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Capturing Aroma';
  public fullName: string = 'Capturing Aroma SIT';
  public text: string =
    'Flip a coin. If heads, search your deck for an Evolution Pokémon, reveal it, and put it into your hand. If tails, search your deck for a Basic Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && (card.evolvesFrom === '' || card.stage === Stage.LV_X)) {
          blocked.push(index);
        }
      });

      return COIN_FLIP_PROMPT(store, state, player, (flipResult) => {
        if (flipResult) {
          // Heads: Evolution Pokémon
          SEARCH_DECK_FOR_CARDS_TO_HAND(
            store,
            state,
            player,
            this,
            { superType: SuperType.POKEMON },
            { min: 0, max: 1, allowCancel: false, blocked },
          );
        } else {
          // Tails: Basic Pokémon
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
            store,
            state,
            player,
            { stage: Stage.BASIC },
            { min: 0, max: 1, allowCancel: false },
          );
        }
      });
    }

    return state;
  }
}
