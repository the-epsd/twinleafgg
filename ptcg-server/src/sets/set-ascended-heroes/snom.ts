import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Snom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Icicle Spear',
    cost: [W],
    damage: 20,
    text: ''
  }
  ];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Snom';
  public fullName: string = 'Snom M2a';
}


