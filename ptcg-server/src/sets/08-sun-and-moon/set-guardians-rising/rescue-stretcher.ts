import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import {
  GameError,
  GameMessage,
  Player,
  PokemonCard,
  State,
  StoreLike,
  TrainerCard,
} from '../../../game';
import {
  MOVE_CARDS,
  SELECT_PROMPT_WITH_OPTIONS,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class RescueStretcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'GRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Rescue Stretcher';
  public fullName: string = 'Rescue Stretcher GRI';
  public text: string = `Choose 1:

  • Put a Pokémon from your discard pile into your hand.
  • Shuffle 3 Pokémon from your discard pile into your deck.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need a Pokémon in the discard pile
    return player.discard.cards.some((c) => c instanceof PokemonCard);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      let pokemonInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof PokemonCard) {
          pokemonInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Player does not have correct cards in discard
      if (pokemonInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, [
        {
          message: GameMessage.CHOOSE_CARD_TO_DECK,
          action: () => {
            store.prompt(
              state,
              new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_CARD_TO_DECK,
                player.discard,
                { superType: SuperType.POKEMON },
                { min: Math.min(pokemonInDiscard, 3), max: 3, allowCancel: false, blocked },
              ),
              (selected) => {
                const cards = selected || [];

                MOVE_CARDS(store, state, player.discard, player.deck, {
                  cards,
                  sourceCard: this,
                });

                SHUFFLE_DECK(store, state, player);
              },
            );
          },
        },
        {
          message: GameMessage.CHOOSE_CARD_TO_HAND,
          action: () => {
            SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              { superType: SuperType.POKEMON },
              { min: 1, max: 1, allowCancel: false, blocked },
            );
          },
        },
      ]);
    }

    return state;
  }
}
