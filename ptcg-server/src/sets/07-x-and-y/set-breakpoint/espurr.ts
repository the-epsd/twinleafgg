import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Espurr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Espurr';
  public fullName: string = 'Espurr BKP';
}
