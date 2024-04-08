import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, 
  GameMessage, ChooseCardsPrompt } from '../../game';


export class Eri extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '146';

  public name: string = 'Eri';

  public fullName: string = 'Eri TEF';

  public text: string =
    'Your opponent reveals their hand. Discard up to 2 Item cards you find there.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
    
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { allowCancel: false , min: 0, max: 2}
      ), cards => {
        if (cards === null || cards.length === 0) {
          return;
        }
        const trainerCard = cards[0] as TrainerCard;
        
        opponent.hand.moveCardTo(trainerCard, opponent.discard);
        player.supporter.moveCardTo(this, player.discard);

      });
    }
    return state;
  }
}