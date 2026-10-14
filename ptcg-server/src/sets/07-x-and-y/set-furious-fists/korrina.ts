import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StoreLike,
  pokemonHasCardType,
} from '../../../game';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { StateUtils } from '../../../game';

export class Korrina extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FFI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Korrina';
  public fullName: string = 'Korrina FFI';
  public text: string =
    'Search your deck for a [F] Pokémon and an Item card, reveal them, and put them into your hand. Shuffle your deck afterward.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
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

      let pokemons = 0;
      let items = 0;
      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
          items += 1;
        } else if (c instanceof PokemonCard && pokemonHasCardType(c, CardType.FIGHTING)) {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const maxPokemons = Math.min(pokemons, 1);
      const maxTrainers = Math.min(items, 1);

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.deck,
          {},
          {
            min: 0,
            max: maxPokemons + maxTrainers,
            allowCancel: false,
            blocked,
            maxPokemons,
            maxTrainers,
          },
        ),
        (selected) => {
          const cards = selected || [];
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
