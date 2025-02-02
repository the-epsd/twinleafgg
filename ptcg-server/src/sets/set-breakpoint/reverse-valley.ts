import { SelectPrompt, StadiumDirection } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ReverseValley extends TrainerCard {

  public trainerType: TrainerType = TrainerType.STADIUM;

  public set: string = 'BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name: string = 'Reverse Valley';

  public fullName: string = 'Reverse Valley BKP';
  
  public text: string =
    'Choose which way this card faces before you play it. The attacks of this â†“ player\'s [D] Pokémon do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).' +
    '' + 
    'Choose which way this card faces before you play it. Any damage done to this â†“ player\'s [M] Pokémon by an opponent\'s attack is reduced by 10 (after applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
    if (effect instanceof PlayStadiumEffect && effect.trainerCard === this) {
      const player = effect.player;
      
      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.UP,
          action: () => {         const stadiumCard = StateUtils.getStadiumCard(state);
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

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const stadiumCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      
      const checkDefenderType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkDefenderType);
      
      // attacking against metal direction down
      if (checkDefenderType.cardTypes.includes(CardType.METAL) && StadiumDirection.UP && 
          owner !== effect.player) {
        effect.damage = Math.max(0, effect.damage - 10);
        effect.damageReduced = true;     
      }
      
      if (checkDefenderType.cardTypes.includes(CardType.METAL) && StadiumDirection.DOWN && 
          owner === effect.player) {
        effect.damage = Math.max(0, effect.damage - 10);
        effect.damageReduced = true;     
      }
    }
    
    if (effect instanceof DealDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const stadiumCardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, stadiumCardList);
      
      const checkPokemonType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonType);

      if (checkPokemonType.cardTypes.includes(CardType.DARK) && StadiumDirection.UP && 
          effect.damage > 0 && effect.target === opponent.active && owner === effect.player) {
        effect.damage += 10;
      }
      
      if (StadiumDirection.DOWN && owner !== player &&
          checkPokemonType.cardTypes.includes(CardType.DARK) && effect.target === opponent.active) {
        effect.damage += 10;
      }      
    }
    
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    return state;
  }

}
