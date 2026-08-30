import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bramblin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Spike Sting',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bramblin';
  public fullName: string = 'Bramblin TEF';
}
