import { Power, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';


export class Aegislash extends PokemonCard {

  public regulationMark = 'D';

  public stage: Stage = Stage.STAGE_2;

  public cardType: CardType = CardType.METAL;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];
  
  public resistance = [{ type: CardType.GRASS, value: -30 }];  
  
  public evolvesFrom = 'Doublade';

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers: Power[] = [{
    name: 'Big Shield',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'All of your Pokémon take 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance). You can\'t apply more than 1 Big Shield Ability at a time.'
  }];
  
  public attacks = [{
    name: 'Power Edge',
    cost: [ CardType.METAL, CardType.METAL, CardType.COLORLESS ],
    damage: 130,
    text: ''
  }];

  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '132';

  public name: string = 'Aegislash';

  public fullName: string = 'Aegislash RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      
      if (owner !== player) {
        return state;
      }
      
      const checkPokemonType = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonType);
      
      if (checkPokemonType.cardTypes.includes(CardType.METAL)) {
        effect.damage = Math.max(0, effect.damage - 30);
        effect.damageReduced = true;     
      }
    }
    
    return state;
  }
}