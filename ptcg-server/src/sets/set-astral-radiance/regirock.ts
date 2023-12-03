import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Regirock extends PokemonCard {

  public cardType = CardType.FIGHTING;
  
  public stage = Stage.BASIC;

  public hp = 130;

  public weakness = [{ type: CardType.GRASS }];

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
      name: 'Giga Impact',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS], 
      damage: 100,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '75';

  public name: string = 'Regirock';

  public fullName: string = 'Regirock ASR';

}
