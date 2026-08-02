import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class SurfingPikachuV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 200;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Surf',
    cost: [W, W, W],
    damage: 150,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CEL';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Surfing Pikachu V';
  public fullName: string = 'Surfing Pikachu V CEL';
}
