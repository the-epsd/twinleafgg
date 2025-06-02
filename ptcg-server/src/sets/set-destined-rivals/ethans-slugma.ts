import { PokemonCard, Stage, CardTag } from '../../game';

export class EthansSlugma extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.ETHANS];

  public cardType = R;

  public hp = 80;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [{
    name: 'Steady Firebreathing',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '35';

  public name: string = 'Ethan\'s Slugma';

  public fullName: string = 'Ethan\'s Slugma DRI';
}
