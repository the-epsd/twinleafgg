import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game';


export class Sandshrew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public powers = 
    [{
      name: 'Sand Screen',
      powerType: PowerType.ABILITY,
      text: 'Trainer cards in your opponent\'s discard pile can\'t be put into their deck by an effect of your opponent\'s Item or Supporter cards.'
    }];

  public attacks = [
    {
      name: 'Scratch',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: '',
    }
  ];

  public regulationMark = 'G';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '27';
  
  public set = 'PAF';

  public name: string = 'Sandshrew';

  public fullName: string = 'Sandshrew PAF';

}