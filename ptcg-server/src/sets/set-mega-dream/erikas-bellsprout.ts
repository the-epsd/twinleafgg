import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class ErikasBellsprout extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Vine Slap',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Erika\'s Bellsprout';
  public fullName: string = 'Erika\'s Bellsprout M2a';
}