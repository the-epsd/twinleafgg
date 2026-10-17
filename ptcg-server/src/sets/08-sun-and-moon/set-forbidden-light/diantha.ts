import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  GamePhase,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  pokemonHasCardTypeOptional,
} from '../../../game';
import { CardType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import {
  REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Diantha extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Diantha';
  public fullName: string = 'Diantha FLI';
  public text: string =
    "You can play this card only if 1 of your [Y] Pokémon was Knocked Out during your opponent's last turn. " +
    'Put 2 cards from your discard pile into your hand.';

  public readonly DIANTHA_MARKER = 'DIANTHA_MARKER';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (!player.marker.hasMarker(this.DIANTHA_MARKER)) {
      return false;
    }
    return player.discard.cards.length >= 2;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // No Pokemon KO last turn
      if (!player.marker.hasMarker(this.DIANTHA_MARKER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.discard.cards.length < 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          {},
          { min: 2, max: 2, allowCancel: false },
        ),
        (cards) => {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this });
          return state;
        },
      );
    }

    if (
      effect instanceof KnockOutEffect &&
      pokemonHasCardTypeOptional(effect.target.getPokemonCard(), CardType.FAIRY)
    ) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.DIANTHA_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner === player) {
        REMOVE_OPPONENT_LAST_TURN_MARKER_AT_END_OF_TURN(effect, this.DIANTHA_MARKER, this);
      }
    }

    return state;
  }
}
