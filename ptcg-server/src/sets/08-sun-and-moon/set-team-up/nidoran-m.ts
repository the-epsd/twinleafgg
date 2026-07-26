import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class NidoranM extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Peck',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Horn Attack',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidoran ♂';
  public fullName: string = 'Nidoran ♂ TEU';
}
