import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Larvesta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Combustion',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'AOR';
  public setNumber: string = '16';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Larvesta';
  public fullName: string = 'Larvesta AOR';
}
