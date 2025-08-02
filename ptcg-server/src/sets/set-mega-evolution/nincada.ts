import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Nincada extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'M1S';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Nincada';
  public fullName: string = 'Nincada M1S';
  public regulationMark: string = 'I';
}

