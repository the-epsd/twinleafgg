import { PokemonCard, Stage, CardTag, CardType } from "../../../game";

export class Pikachuex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 200;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunderbolt',
    cost: [L, L, C],
    damage: 120,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'PR-SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Pikachu ex';
  public fullName: string = 'Pikachu ex PR-SV';
}
