import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class SurfingPikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Surf',
    cost: [W, W],
    damage: 30,
    text: ''
  }];

  public set: string = 'EVO';
  public setNumber: string = '111';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Surfing Pikachu';
  public fullName: string = 'Surfing Pikachu EVO';
}
