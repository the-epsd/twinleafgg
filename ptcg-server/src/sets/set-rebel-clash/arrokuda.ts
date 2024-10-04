import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Arrokuda extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 60;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.LIGHTNING }];

  public attacks = [{
    name: 'Rain Splash',
    cost: [CardType.WATER],
    damage: 20,
    text: ''
  }];

  public set: string = 'RCL';
  public setNumber: string = '52';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arrokuda';
  public fullName: string = 'Arrokuda RCL';
}