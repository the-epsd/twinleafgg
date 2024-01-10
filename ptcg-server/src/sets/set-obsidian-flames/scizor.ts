import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Scizor extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public attacks = [
    { 
      name: 'Punishing Scissors', 
      cost: [CardType.METAL], 
      damage: 10, 
      text: 'This attack does 50 more damage for each of your opponent\'s Pokémon in play that has an Ability.' 
    },
    { 
      name: 'Cut', 
      cost: [CardType.METAL, CardType.METAL], 
      damage: 70, 
      text: '' 
    },   
  ];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '141';

  public name: string = 'Scizor';

  public fullName: string = 'Scizor OBF';

}

