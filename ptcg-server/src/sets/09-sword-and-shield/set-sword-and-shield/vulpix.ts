import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vulpix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flare',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vulpix';
  public fullName: string = 'Vulpix SSH';
}
