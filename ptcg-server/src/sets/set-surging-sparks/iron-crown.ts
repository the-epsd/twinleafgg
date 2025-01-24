import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class IronCrown extends PokemonCard {

  public tags = [ CardTag.FUTURE ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Deleting Slash', 
      cost: [ CardType.METAL, CardType.COLORLESS ], 
      damage: 40, 
      text: 'If your opponent has 3 or more Benched Pokémon, this attack does 80 more damage.' 
    },

    { 
      name: 'Slicing Blade', 
      cost: [ CardType.METAL, CardType.COLORLESS, CardType.COLORLESS ], 
      damage: 100, 
      text: '' 
    },
    
  ];

  public set: string = 'SSP';

  public setNumber = '132';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Iron Crown';

  public fullName: string = 'Iron Crown SSP';

  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (benched >= 3){
        effect.damage += 80;
      }
    }

    return state;
  }
  
}