import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardType, Format } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { StateUtils } from '../../../game/store/state-utils';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { GameError, Player, pokemonHasCardType } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Irida extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '147';
  public name: string = 'Irida';
  public fullName: string = 'Irida ASR';
  public text: string =
    'Search your deck for a [W] Pokémon and an Item ' +
    'card, reveal them, and put them into your hand. ' +
    'Then, shuffle your deck.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      // Determine format
      const format = (store as any).handler.format;

      // Count pokemons and items/tools separately
      let pokemons = 0;
      let itemsOrTools = 0;
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && pokemonHasCardType(c, CardType.WATER)) {
          pokemons += 1;
        } else if (
          c instanceof TrainerCard &&
          (c.trainerType === TrainerType.ITEM ||
            (format === Format.SWSH && c.trainerType === TrainerType.TOOL))
        ) {
          itemsOrTools += 1;
        } else {
          blocked.push(index);
        }
      });

      // Limit max for each type to 1
      const maxPokemons = Math.min(pokemons, 1);
      const maxItemsOrTools = Math.min(itemsOrTools, 1);

      // Total max is sum of max for each
      const count = maxPokemons + maxItemsOrTools;

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxItems: maxItemsOrTools },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          return SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
