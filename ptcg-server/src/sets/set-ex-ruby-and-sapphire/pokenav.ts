import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { CardList, GameMessage, ChooseCardsPrompt, GameLog, StateUtils, GameError, PokemonCard, EnergyCard, OrderCardsPrompt } from '../../game';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';

export class PokeNav extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'PokéNav';
  public fullName: string = 'PokéNav RS';

  public text: string =
    'Look at the top 3 cards of your deck. You may reveal a Pokémon or Energy card you find there and put it into your hand. Put the other cards back in any order.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 3);

      const blocked: number[] = [];
      temp.cards.forEach((c, index) => {
        const isPokemon = c instanceof PokemonCard;
        const isBasicEnergy = c instanceof EnergyCard;
        if (!isPokemon && !isBasicEnergy) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        {},
        { allowCancel: false, min: 0, max: 1, blocked }
      ), chosenCards => {

        if (chosenCards.length > 0) {
          // Move chosen card to hand
          const chosen = chosenCards[0];
          temp.moveCardTo(chosen, player.hand);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, chosenCards);
          chosenCards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });
        }

        // Create a CardList of the remaining cards (excluding the chosen card)
        const remaining = new CardList();
        temp.cards.forEach(card => {
          if (!chosenCards.includes(card)) {
            remaining.cards.push(card);
          }
        });

        store.prompt(state, new OrderCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARDS_ORDER,
          remaining,
          { allowCancel: false },
        ), order => {
          if (order === null) {
            return state;
          }

          remaining.applyOrder(order);
          remaining.moveToTopOfDestination(player.deck);
        });

        player.supporter.moveCardTo(this, player.discard);
      });
    }
    return state;
  }
}