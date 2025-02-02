import { ShuffleDeckPrompt } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class SingleStrikeStyleMustard extends TrainerCard {

  public regulationMark = 'E';

  public tags = [CardTag.SINGLE_STRIKE];

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Single Strike Style Mustard';

  public fullName: string = 'Single Strike Style Mustard BST';

  public text: string =
    'You can play this card only when it is the last card in your hand. ' +
    '' +
    'Search your deck for a Single Strike Pokémon and put it onto your Bench. Then, shuffle your deck. If you searched your deck in this way, draw 5 cards.';

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
      
      const cards = player.hand.cards.filter(c => c !== this);

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !card.tags.includes(CardTag.SINGLE_STRIKE)) {
          blocked.push(index);
        }
      });

      const slot = player.bench.find(b => b.cards.length === 0);
      const hasEffect = slot || player.deck.cards.length > 0;

      if (cards.length !== 0 || !hasEffect) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: false, blocked: blocked }
      ), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, slot!);
        slot!.pokemonPlayedTurn = state.turn;
        
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          
          player.deck.moveTo(player.hand, 5);  
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        });       
      });
    }

    return state;
  }

}
