import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Regice extends PokemonCard {

  public cardType = CardType.WATER;
  
  public stage = Stage.BASIC;

  public hp = 130;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Regi Gate',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Blizzard Bind',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS], 
      damage: 100,
      text: 'If the Defending Pokémon is a Pokémon V, it can\'t attack during your opponent\'s next turn.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '37';

  public name: string = 'Regice';

  public fullName: string = 'Regice ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

      
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
  
      //   if (opponent.active && opponent.active.cards.some(c => c instanceof PokemonCard && c.category === CardType.POKEMON_V)) {
      //     opponent.active.setNoAttackNextTurn();
      //   }
      // }
  
      return state;
    }
    return state;
  }
}