import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Beam',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite M1S';
}
