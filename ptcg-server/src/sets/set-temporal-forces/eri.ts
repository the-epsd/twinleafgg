import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, 
  GameMessage, PokemonCardList, ChooseCardsPrompt } from '../../game';


export class Eri extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SV5';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Eri';

  public fullName: string = 'Eri SV5';

  public text: string =
    'Your opponent reveals their hand. Discard up to 2 Item cards you find there.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const deckBottom = StateUtils.findCardList(state, this) as PokemonCardList;

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
        deckBottom.moveTo(opponent.deck);

        player.supporter.moveCardTo(this, player.discard);

      });
    }
    return state;
  }
}