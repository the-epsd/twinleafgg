import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { GameError, GameMessage, CardList, ChooseCardsPrompt } from '../../game';


export class ExplorersGuidance extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SV5K';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '67';

  public regulationMark = 'H';

  public name: string = 'Explorer\'s Guidance';

  public fullName: string = 'Explorer\'s Guidance SV5K';

  public text: string = 'Heal all damage from 1 of your Pokémon that has 30 HP or less remaining.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 6);
      
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { },
        { min: 2, max: 2, allowCancel: false }
      ), selected => {
        deckTop.moveCardsTo(selected, player.hand);
        deckTop.moveTo(player.discard);
    
      });
    }
    return state;
  }

}
