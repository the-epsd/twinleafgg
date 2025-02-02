import { GameError, PokemonCard, SelectPrompt } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RescueStretcher extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Rescue Stretcher';

  public fullName: string = 'Rescue Stretcher GRI';

  public text: string =
    'Choose 1:' +
    '' +
    'Put a Pokémon from your discard pile into your hand.' +
    'Shuffle 3 Pokémon from your discard pile into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      let pokemonInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        if (isPokemon) {
          pokemonInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Player does not have correct cards in discard
      if (pokemonInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.CHOOSE_CARD_TO_DECK,
          action: () => {

            let cards: Card[] = [];

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DECK,
              player.discard,
              { superType: SuperType.POKEMON },
              { min: Math.min(pokemonInDiscard, 3), max: 3, allowCancel: false, blocked }
            ), selected => {
              cards = selected || [];
              cards.forEach((card, index) => {
                store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
              });

              player.discard.moveCardsTo(cards, player.deck);
              player.supporter.moveCardTo(effect.trainerCard, player.discard);

              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            });
          }
        },
        {
          message: GameMessage.CHOOSE_CARD_TO_HAND,
          action: () => {
            let cards: Card[] = [];

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.discard,
              { superType: SuperType.POKEMON },
              { min: 1, max: 1, allowCancel: false, blocked }
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
        }
      ];

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }

}