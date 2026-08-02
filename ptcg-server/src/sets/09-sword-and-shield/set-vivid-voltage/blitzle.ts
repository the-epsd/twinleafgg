import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Blitzle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Zap Kick',
    cost: [L],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blitzle';
  public fullName: string = 'Blitzle VIV';
}
