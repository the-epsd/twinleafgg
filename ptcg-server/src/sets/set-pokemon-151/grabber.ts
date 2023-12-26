import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils, 
  GameMessage, PokemonCardList, ChooseCardsPrompt } from '../../game';


export class Grabber extends TrainerCard {

  public regulationMark = 'G';

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = '151';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '162';

  public name: string = 'Grabber';

  public fullName: string = 'Grabber 151';

  public text: string =
    'Your opponent reveals their hand, and you put a Pokémon you find there on the bottom of their deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const deckBottom = StateUtils.findCardList(state, this) as PokemonCardList;
    
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_DECK,
        opponent.hand,
        { superType: SuperType.POKEMON },
        { allowCancel: true , min: 0, max: 1}
      ), cards => {
        if (cards === null || cards.length === 0) {
          return;
        }
        const trainerCard = cards[0] as TrainerCard;
        
        opponent.hand.moveCardTo(trainerCard, deckBottom);
        deckBottom.moveTo(opponent.deck);
      });
    }
    return state;
  }
}