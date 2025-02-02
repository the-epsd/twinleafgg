import { GameError, PokemonCard } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { DiscardToHandEffect, TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Revitalizer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'GEN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name: string = 'Revitalizer';

  public fullName: string = 'Revitalizer GEN';

  public text: string =
    'Put 2 [G] Pokémon from your discard pile into your hand.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      let pokemonInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.cardType === CardType.GRASS) {
          pokemonInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Player does not have correct cards in discard
      if (pokemonInDiscard === 0) {
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

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let cards: Card[] = [];

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.POKEMON },
        { min: Math.min(pokemonInDiscard, 2), max: 2, allowCancel: false, blocked }
      ), selected => {
        cards = selected || [];

        cards.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
        });

        player.discard.moveCardsTo(cards, player.hand);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);

        return state;
      });
    }

    return state;
  }

}