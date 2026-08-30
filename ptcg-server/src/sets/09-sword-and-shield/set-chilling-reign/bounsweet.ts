import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bounsweet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Splash',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bounsweet';
  public fullName: string = 'Bounsweet CRE';
}
