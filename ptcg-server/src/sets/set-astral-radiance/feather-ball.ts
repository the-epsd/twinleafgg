import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameMessage } from '../../game/game-message';
import { StoreLike, State, StateUtils, CardTarget, PokemonCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export class FeatherBall extends TrainerCard {
  
  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

  public name: string = 'Feather Ball';

  public fullName: string = 'Feather Ball ASR';
  
  public text = 
    'Search your deck for 1 Pokemon with no retreat cost, ' +
      'show it to your opponent, and put it into your hand. ' + 
      'Shuffle your deck afterward.';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const blocked: CardTarget[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.retreat.length === 0) {
          blocked.push(); // Changed index to card
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false }
      ), (cards) => {

        if (!cards || cards.length === 0) {
          return state;
        }

        const pokemon = cards[0];

        player.deck.moveCardTo(pokemon, player.hand);
        player.supporter.moveCardTo(this, player.discard);

        return store.prompt(state, [
          new ShowCardsPrompt(opponent.id, GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, [pokemon]),
          new ShuffleDeckPrompt(player.id)
        ], (results) => {
          player.deck.applyOrder(results[1]);
        });

      });

    }

    return state;
  }


      
}
      