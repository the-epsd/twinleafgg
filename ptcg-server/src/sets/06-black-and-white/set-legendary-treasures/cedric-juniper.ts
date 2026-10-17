import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import {
  StoreLike,
  State,
  StateUtils,
  GameMessage,
  GameError,
  SelectPrompt,
  CardList,
  ChooseCardsPrompt,
  ShowCardsPrompt,
  Player,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { PokemonCard } from '../../../game/store/card/pokemon-card';

export class CedricJuniper extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'LTR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Cedric Juniper';
  public fullName: string = 'Cedric Juniper LTR';
  public text: string =
    "Put a Pokémon from your hand face down in front of you and tell your opponent its name. Your opponent guesses the height of that Pokémon. Reveal that Pokémon. If your opponent guessed right, he or she draws 3 cards. If your opponent guessed wrong, you draw 3 cards. Return the Pokémon to your hand. (You can't choose a Pokémon that doesn't have the height printed on the card.) You may play only 1 Supporter card during your turn (before your attack).";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.hand.cards.some((c) => c instanceof PokemonCard);
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const hasPokemonInHand = player.hand.cards.some((c) => c instanceof PokemonCard);

      if (!hasPokemonInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const selectedPokemon = new CardList();
      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.hand,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length === 0) {
            return;
          }

          MOVE_CARDS(store, state, player.hand, selectedPokemon, {
            cards: cards,
            sourceCard: this,
          });

          store.prompt(
            state,
            new SelectPrompt(
              opponent.id,
              GameMessage.CHOOSE_OPTION,
              ['Guessed right', 'Guessed wrong'],
              { allowCancel: false },
            ),
            (choice) => {
              const opponentGuessedRight = choice === 0;

              store.prompt(
                state,
                new ShowCardsPrompt(
                  opponent.id,
                  GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                  selectedPokemon.cards,
                ),
                () => {
                  if (opponentGuessedRight) {
                    DRAW_CARDS(store, state, opponent, 3);
                  } else {
                    DRAW_CARDS(store, state, player, 3);
                  }

                  MOVE_CARDS(store, state, selectedPokemon, player.hand, { sourceCard: this });
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
