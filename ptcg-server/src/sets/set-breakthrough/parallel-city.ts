import { SelectPrompt, StadiumDirection } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ParallelCity extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BKT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '145';

  public name: string = 'Parallel City';

  public fullName: string = 'Parallel City BKT';
  
  public text: string =
    'Choose which way this card faces before you play it. This â†“ player can\'t have more than 3 Benched Pokémon. (When this card comes into play, this â†“ player discards Benched Pokémon until he or she has 3 Pokémon on the Bench.)' +
    '' + 
    'Choose which way this card faces before you play it. Any damage done by attacks from this â†“ player\'s [G] [R] or [W] Pokémon is reduced by 20 (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PlayStadiumEffect && effect.trainerCard === this) {
      const player = effect.player;
      
      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.UP,
          action: () => {
            const stadiumCard = StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined ) {
              const cardList = StateUtils.findCardList(state, stadiumCard);
              cardList.stadiumDirection = StadiumDirection.UP;
              return state; 
            }
          }
        },
        {
          message: GameMessage.DOWN,
          action: () => { const stadiumCard = StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined ) {
              const cardList = StateUtils.findCardList(state, stadiumCard);
              cardList.stadiumDirection = StadiumDirection.DOWN; 
              return state;
            }
          }
        }];
        
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.WHICH_DIRECTION_TO_PLACE_STADIUM,
        options.map(c => c.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];

        if (option.action) {
          option.action();
        }
        
        return state;
      });
    }
    
    if (effect instanceof CheckTableStateEffect && StateUtils.getStadiumCard(state) === this) {
      const stadiumCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      
      const benchSizes = [0, 0];
      if (stadiumCardList.stadiumDirection === StadiumDirection.UP) {
        state.players.forEach((p, index) => {
          if (p === owner) {
            benchSizes[index] = 5;
          } else {
            benchSizes[index] = 3;
          }
        });
        
        effect.benchSizes = benchSizes;
      } 
      if (stadiumCardList.stadiumDirection === StadiumDirection.DOWN) {
        state.players.forEach((p, index) => {
          if (p === owner) {
            benchSizes[index] = 3;
          } else {
            benchSizes[index] = 5;
          }
        });
        
        effect.benchSizes = benchSizes;
      }
    }

    if (effect instanceof DealDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const stadiumCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      
      if (effect.player === owner && stadiumCardList.stadiumDirection === StadiumDirection.UP &&
          (effect.player.active.getPokemonCard()?.cardType === CardType.FIRE ||
          effect.player.active.getPokemonCard()?.cardType === CardType.WATER ||
          effect.player.active.getPokemonCard()?.cardType === CardType.GRASS)) {
        effect.damage -= 20;
      } else if (effect.player !== owner && stadiumCardList.stadiumDirection === StadiumDirection.DOWN &&
        (effect.player.active.getPokemonCard()?.cardType === CardType.FIRE ||
        effect.player.active.getPokemonCard()?.cardType === CardType.WATER ||
        effect.player.active.getPokemonCard()?.cardType === CardType.GRASS)) {
        effect.damage -= 20;
      }
    }
    
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
