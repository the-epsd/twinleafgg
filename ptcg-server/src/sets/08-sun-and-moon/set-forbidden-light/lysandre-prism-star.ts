import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  PlayerType,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { CardTag, CardType, TrainerType } from '../../../game/store/card/card-types';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LysandrePrismStar extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.PRISM_STAR];
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Lysandre Prism Star';
  public fullName: string = 'Lysandre Prism Star FLI';
  public text: string =
    "For each of your [R] Pokémon in play, put a card from your opponent's discard pile in the Lost Zone.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    return opponent.discard.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let firesInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, pokemonType);
        if (pokemonType.cardTypes.includes(CardType.FIRE)) {
          firesInPlay++;
        }
      });

      // Prism Star: this card goes to the Lost Zone instead of the discard pile (handled on trainer cleanup)
      if (!firesInPlay) {
        return state;
      }

      const count = Math.min(opponent.discard.cards.length, firesInPlay);
      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.discard,
          {},
          { min: count, max: count, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];

          // Operation canceled by the user
          if (cards.length === 0) {
            return state;
          }

          MOVE_CARDS(store, state, opponent.discard, opponent.lostzone, {
            cards,
            sourceCard: this,
          });
        },
      );
    }

    return state;
  }
}
