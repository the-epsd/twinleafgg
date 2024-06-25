import { GameError, GameMessage, State, StoreLike, TrainerCard } from '../..';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, RetreatEffect } from '../../game/store/effects/game-effects';

export class LilliesPokeDoll extends TrainerCard {

  public trainerType = TrainerType.ITEM;
  
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.NONE;
  
  public hp: number = 10;
  
  public weakness = [ ];
  
  public retreat = [ ];
  
  public attacks = [];
  
  public set: string = 'CEC';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '197';
  
  public name: string = 'Lillie\'s Poké Doll';
  
  public fullName: string = 'Lillie\'s Poké Doll CEC';
  
  public text =
    'Play this card as if it were a 30-HP [C] Basic Pokémon. At any time during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard all cards from it and put it on the bottom of your deck.' +
    '' + 
    'This card can\'t retreat. If this card is Knocked Out, your opponent can\'t take any Prize cards for it.';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    this.superType = SuperType.TRAINER;
  
    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }
    
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
      return state;
    }

    return state;
  }

}
