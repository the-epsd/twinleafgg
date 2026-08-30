import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nymble extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 40;
  public weakness = [{ type: R }];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nymble';
  public fullName: string = 'Nymble PAR';
}
