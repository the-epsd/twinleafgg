import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class PikachuV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 200;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Thunderbolt',
    cost: [L, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikachu V';
  public fullName: string = 'Pikachu V FST 86';
}
