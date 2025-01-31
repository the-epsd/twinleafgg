import { PokemonCard, Stage, CardType } from '../../game';

export class Quaxwell extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Quaxly';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Rain Splash',
      cost: [ W ],
      damage: 20,
      text: ''
    },
    {
      name: 'Spiral Kick',
      cost: [ W, C, C ],
      damage: 70,
      text: ''
    },
    
  ];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Quaxwell';
  public fullName: string = 'Quaxwell SVI';
}