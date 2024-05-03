import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { GameError, GameMessage, StateUtils } from '../../game';

export class Haunter extends PokemonCard {

  public name = 'Haunter';
  
  public set = 'BS';
  
  public fullName = 'Haunter BS';
  
  public stage = Stage.STAGE_1;
  
  public evolvesFrom = 'Gastly';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';
  
  public cardType: CardType = CardType.PSYCHIC;  

  public hp = 60;

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Hypnosis',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Dream Eater',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 50,
      text: 'You can\'t use this attack unless the Defending Pokémon is Asleep.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {      
      const condition = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      return store.reduceEffect(state, condition);
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {      
      
      const opponent = StateUtils.getOpponent(state, effect.player);
      
      if (!opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }
    
    return state;
  }

}
