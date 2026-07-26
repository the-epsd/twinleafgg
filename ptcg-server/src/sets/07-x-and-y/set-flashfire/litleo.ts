import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Litleo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Combustion',
    cost: [R, R, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'FLF';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Litleo';
  public fullName: string = 'Litleo FLF';
}
