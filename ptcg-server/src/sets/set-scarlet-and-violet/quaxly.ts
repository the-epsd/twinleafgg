import { PokemonCard, Stage, CardType } from '../../game';

export class Quaxly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Pound',
      cost: [ C ],
      damage: 10,
      text: ''
    },
    {
      name: 'Kick',
      cost: [ W, C ],
      damage: 20,
      text: ''
    },
    
  ];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quaxly';
  public fullName: string = 'Quaxly SVI';
}