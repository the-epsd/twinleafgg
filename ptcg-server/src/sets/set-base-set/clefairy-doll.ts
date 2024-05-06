import { GameError, GameMessage, TrainerCard } from '../../game';
import { CardType, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ClefairyDoll extends TrainerCard {
  public name = 'Clefairy Doll';
  public setNumber = '70';
  public set = 'BS';
  public fullName = 'Clefairy Doll BS';
  public hp = 10;
  
  public superType = SuperType.TRAINER;
  public trainerType = TrainerType.ITEM;
  
  public stage = Stage.NONE;
  public cardType = CardType.NONE;
  public attacks = [];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clefairy Doll can't be affected by special conditions
    if (effect instanceof AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
      effect.preventDefault = true;
    }
    
    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
    }    
    
    return state;
  }
}
