import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, EnergyType, TrainerType } from '../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, EnergyCard, GameError, PokemonCard, ShuffleDeckPrompt } from '../../game';

export class Candice extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '152';

  public regulationMark = 'F';

  public name: string = 'Candice';

  public fullName: string = 'Candice SIT';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal any number of [W] Pokémon and [W] Energy cards you find there and put them into your hand. Shuffle the other cards back into your deck.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();

      const blocked: number[] = [];
      deckTop.cards.forEach((card, index) => {
        if ((card instanceof PokemonCard && card.cardType === CardType.WATER) || (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Water Energy')) {
          // No else block needed
        } else {
          blocked.push(index);
        }
      });

      player.deck.moveTo(deckTop, 7);

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        {},
        { min: 0, max: 7, allowCancel: true, blocked: blocked }
      ), selected => {

        if (selected.length > 0) {

          deckTop.moveCardsTo(selected, player.hand);
          deckTop.moveTo(player.deck);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          player.supporterTurn = 1;

        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      });
    }
    return state;
  }
}
    