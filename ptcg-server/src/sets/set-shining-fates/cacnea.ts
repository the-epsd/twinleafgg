import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Cacnea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pierce',
    cost: [G, G],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'SHF';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cacnea';
  public fullName: string = 'Cacnea SHF';
}
