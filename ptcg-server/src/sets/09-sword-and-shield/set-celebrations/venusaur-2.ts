import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Venusaur2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType[] = [G];
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Solarbeam',
    cost: [G, G, G, G],
    damage: 60,
    text: ''
  }];

  public set: string = 'CEL';
  public setNumber: string = '15A1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Venusaur';
  public fullName: string = 'Venusaur CEL 15A1';
}
