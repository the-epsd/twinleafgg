import { HealEffect } from '../../game/store/effects/game-effects';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../..';

export class CrystalCave extends TrainerCard {

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '144';
    
  public  trainerType = TrainerType.STADIUM;
  
  public set = 'EVS';
  
  public name = 'Crystal Cave';
  
  public fullName = 'Crystal Cave EVS';
    
  public  text = 'Once during each player\'s turn, that player may heal 30 damage from each of their [M] Pokémon and [N] Pokémon.';
        
  useStadium(store: StoreLike, state: State, effect: UseStadiumEffect): State {

    const player = effect.player;

    // Heal each Pokemon by 10 damage
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const pokemonCard = cardList as unknown as PokemonCard;
      if (pokemonCard.cardType === CardType.METAL || CardType.DRAGON) {
        const healEffect = new HealEffect(player, cardList, 10);
        state = store.reduceEffect(state, healEffect);
      }
      return state;
    });
    return state;
  }
}
