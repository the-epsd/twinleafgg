import { ChoosePokemonPrompt, GameError, PlayerType, SlotType } from '../../game';
import { GameMessage } from '../../game/game-message';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Surfer extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '187';

  public regulationMark = 'H';
  
  public name: string = 'Surfer';

  public fullName: string = 'Surfer SSP';

  public text: string =
    'Switch your Active Pokémon with 1 of your Benched Pokémon. If you do, draw cards until you have 5 cards in your hand.';


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

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        player.switchPokemon(cardList);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
              
        while (player.hand.cards.length < 5) {
          if (player.deck.cards.length === 0) {
            break;
          }
          player.deck.moveTo(player.hand, 1);
        }
        
        return state;
      });
      
    }
    return state;
  }



}