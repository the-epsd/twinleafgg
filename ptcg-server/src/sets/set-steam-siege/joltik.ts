import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 30;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Attach',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik STS';
}