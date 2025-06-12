import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = D;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [C, C],
      damage: 20,
      text: "Flip a coin. If heads, your opponent's Active Pokémon is now Paralyzed."
    },
    {
      name: 'Darkness Fang',
      cost: [D, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'SV11W';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Deino';
  public fullName: string = 'Deino SV11W';
}

