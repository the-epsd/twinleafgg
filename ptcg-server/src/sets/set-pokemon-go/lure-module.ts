import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, GameMessage, StateUtils, ShuffleDeckPrompt, ShowCardsPrompt, PokemonCard } from '../../game';

export class LureModule extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '67';

  public name: string = 'Lure Module';

  public fullName: string = 'Lure Module PGO';

  public text: string =
    'Each player reveals the top 3 cards of their deck and puts all Pokémon they find there into their hand. Then, each player shuffles the other cards back into their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 3);

      // Check if any cards drawn are basic energy
      const pokemonDrawn = temp.cards.filter(card => {
        return card instanceof PokemonCard;
      });

      // If no energy cards were drawn, move all cards to deck
      if (pokemonDrawn.length == 0) {

        return store.prompt(state, new ShowCardsPrompt(
          player.id && opponent.id,
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        ), () => {

          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
          });

          player.supporter.moveCardTo(this, player.discard);

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });

        });

      } else {

        pokemonDrawn.forEach(pokemon => {
          temp.moveCardTo(pokemon, player.deck);
        });

        temp.cards.forEach(card => {
          temp.moveCardTo(card, player.deck);
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          return state;
        });
      }
    }

    const player = (effect as TrainerEffect).player;

    const opponent = StateUtils.getOpponent(state, player);
    const tempOpp = new CardList();
  
    opponent.deck.moveTo(tempOpp, 3);
  
    const pokemonDrawnOpp = tempOpp.cards.filter(card => {
      return card instanceof PokemonCard;
    });
  
    // If no energy cards were drawn, move all cards to deck
    if (pokemonDrawnOpp.length == 0) {
  
      return store.prompt(state, new ShowCardsPrompt(
        player.id && opponent.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        tempOpp.cards
      ), () => {
  
        tempOpp.cards.forEach(card => {
          tempOpp.moveCardTo(card, opponent.deck);
        });
  
        return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
          opponent.deck.applyOrder(order);
          return state;
        });
  
      });
  
    } else {
  
      pokemonDrawnOpp.forEach(pokemon => {
        tempOpp.moveCardTo(pokemon, opponent.deck);
      });
  
      tempOpp.cards.forEach(card => {
        tempOpp.moveCardTo(card, opponent.deck);
      });
  
      return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        return state;
      });
      return state;
    }
  }
}
