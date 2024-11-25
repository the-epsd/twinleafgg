import { Card, ChooseCardsPrompt, GameError, GameLog, GameMessage, PokemonCard, StateUtils } from '../../game';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class BuddyBuddyRescue extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '135';

  public name: string = 'Buddy-Buddy Rescue';

  public fullName: string = 'Buddy-Buddy Rescue SSH';

  public text: string =
    'Each player puts a Pokémon from his or her discard pile into his or her hand. (Your opponent chooses first.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonInPlayersDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        if (isPokemon) {
          pokemonInPlayersDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      let pokemonInOpponentsDiscard: number = 0;
      const blockedOpponent: number[] = [];
      opponent.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        if (isPokemon) {
          pokemonInOpponentsDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      if (pokemonInOpponentsDiscard === 0 && pokemonInPlayersDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);

      if (discardEffect.preventDefault) {
        // If prevented, just discard the card and return
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      }

      if (pokemonInOpponentsDiscard > 0) {
        let cards: Card[] = [];

        store.prompt(state, new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_HAND,
          opponent.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false, blocked }
        ), selected => {
          cards = selected || [];

          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: opponent.name, card: card.name });
          });

          opponent.discard.moveCardsTo(cards, opponent.hand);
          opponent.supporter.moveCardTo(effect.trainerCard, opponent.discard);
        });
      }

      if (pokemonInPlayersDiscard > 0) {
        let cards: Card[] = [];

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.discard,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false, blocked: blockedOpponent }
        ), selected => {
          cards = selected || [];

          cards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          player.discard.moveCardsTo(cards, player.hand);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        });
      }

      return state;
    }

    return state;
  }

}