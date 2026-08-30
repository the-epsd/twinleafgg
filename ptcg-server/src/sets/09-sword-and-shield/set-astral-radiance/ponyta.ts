import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flame Tail',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta ASR 21';
}
