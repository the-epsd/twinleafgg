import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SpecialCondition, TrainerType } from '../../game/store/card/card-types';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { GameError, GameMessage, StateUtils } from '../../game';

export class Atticus extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '56';
  
  public set = 'SV4';
  
  public name = 'Atticus';
  
  public fullName = 'Atticus SV4';

  public text: string =
    'You can use this card only if your opponent’s Active Pokémon is Poisoned.' +
''+
    'Shuffle your hand into your deck, then draw 7 cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const cards = player.hand.cards.filter(c => c !== this);
      const opponent = StateUtils.getOpponent(state, player);

      const isPoisoned = opponent.active.specialConditions.includes(SpecialCondition.POISONED);

      if (!isPoisoned) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (cards.length > 0) {
        player.hand.moveCardsTo(cards, player.deck);

        store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }

      player.deck.moveTo(player.hand, 7);
      return state;
    }
    return state;
  }
}