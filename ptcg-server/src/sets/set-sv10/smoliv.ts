import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Smoliv extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Smoliv';
  public fullName: string = 'Smoliv SV10';
}
