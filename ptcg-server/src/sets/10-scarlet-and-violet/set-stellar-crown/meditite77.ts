import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class MedititeSCR77 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Beat',
    cost: [F],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Meditite';
  public fullName: string = 'Meditite SCR 77';
}
