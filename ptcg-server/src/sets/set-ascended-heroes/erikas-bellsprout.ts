import { PokemonCard, Stage, CardTag, CardType } from "../../game";

export class ErikasBellsprout extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Vine Slap',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Erika\'s Bellsprout';
  public fullName: string = 'Erika\'s Bellsprout MC';
}