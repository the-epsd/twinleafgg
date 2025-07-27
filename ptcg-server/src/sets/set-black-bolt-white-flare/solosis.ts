import { PokemonCard, Stage, CardType } from '../../game';

export class Solosis extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 40;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Solosis';
  public fullName: string = 'Solosis SV11B';
}
