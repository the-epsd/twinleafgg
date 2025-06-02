import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Scraggy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Low Kick',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'Headstrike',
    cost: [D, D, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAF';
  public setNumber = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scraggy';
  public fullName: string = 'Scraggy PAF';
}
