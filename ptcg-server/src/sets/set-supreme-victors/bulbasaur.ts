import { Attack, CardType, PokemonCard, Stage } from '../../game';

export class Bulbasaur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks: Attack[] = [
    {
      name: 'Tackle',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Vine Whip',
      cost: [G, C],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'SV';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur SV';

}