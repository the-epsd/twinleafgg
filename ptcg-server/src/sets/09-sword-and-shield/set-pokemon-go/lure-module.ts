import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  Player,
  CardList,
  GameMessage,
  StateUtils,
  ShowCardsPrompt,
  PokemonCard,
} from '../../../game';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LureModule extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'PGO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Lure Module';
  public fullName: string = 'Lure Module PGO';
  public text: string =
    'Each player reveals the top 3 cards of their deck and puts all Pokémon they find there into their hand. Then, each player shuffles the other cards back into their deck.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const tempOpp = new CardList();

      effect.preventDefault = true;

      MOVE_CARDS(store, state, opponent.deck, tempOpp, { count: 3, sourceCard: this });

      return store.prompt(
        state,
        new ShowCardsPrompt(player.id, GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT, tempOpp.cards),
        () => {
          return store.prompt(
            state,
            new ShowCardsPrompt(
              opponent.id,
              GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT,
              tempOpp.cards,
            ),
            () => {
              const pokemonCards = tempOpp.cards.filter((card) => card instanceof PokemonCard);
              const nonPokemonCards = tempOpp.cards.filter(
                (card) => !(card instanceof PokemonCard),
              );

              pokemonCards.forEach((card) => {
                MOVE_CARDS(store, state, tempOpp, opponent.hand, {
                  cards: [card],
                  sourceCard: this,
                });
              });

              nonPokemonCards.forEach((card) => {
                MOVE_CARDS(store, state, tempOpp, opponent.deck, {
                  cards: [card],
                  sourceCard: this,
                });
              });

              const temp = new CardList();
              MOVE_CARDS(store, state, player.deck, temp, { count: 3, sourceCard: this });

              return store.prompt(
                state,
                new ShowCardsPrompt(
                  player.id,
                  GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT,
                  temp.cards,
                ),
                () => {
                  return store.prompt(
                    state,
                    new ShowCardsPrompt(
                      opponent.id,
                      GameMessage.PLAYER_CARDS_REVEALED_BY_EFFECT,
                      temp.cards,
                    ),
                    () => {
                      const pokemonCards = temp.cards.filter((card) => card instanceof PokemonCard);
                      const nonPokemonCards = temp.cards.filter(
                        (card) => !(card instanceof PokemonCard),
                      );

                      pokemonCards.forEach((card) => {
                        MOVE_CARDS(store, state, temp, player.hand, {
                          cards: [card],
                          sourceCard: this,
                        });
                      });

                      nonPokemonCards.forEach((card) => {
                        MOVE_CARDS(store, state, temp, player.deck, {
                          cards: [card],
                          sourceCard: this,
                        });
                      });

                      MOVE_CARDS(store, state, player.supporter, player.discard, {
                        cards: [this],
                        sourceCard: this,
                      });

                      SHUFFLE_DECK(store, state, player);
                      return SHUFFLE_DECK(store, state, opponent);
                    },
                  );
                },
              );
            },
          );
        },
      );
    }
    return state;
  }
}
