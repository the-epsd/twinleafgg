import { PokemonCard, Stage, CardType, PowerType } from '../../game';

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom: string = 'Mysterious Fossil';
  public cardType: CardType = W;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Clairvoyance',
    powerType: PowerType.ABILITY,
    text: 'Your opponent plays with his or her hand face up. This power stops working while Omanyte is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each [W] Energy attached to Omanyte but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.',
  }];

  public set: string = 'FO';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Omanyte';
  public fullName: string = 'Omanyte FO';
}