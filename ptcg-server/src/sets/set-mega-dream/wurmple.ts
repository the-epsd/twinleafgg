import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Bug Bite',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Wurmple';
  public fullName: string = 'Wurmple M2a';
}
