import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Smash Kick',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Flame Tail',
    cost: [R, R],
    damage: 30,
    text: ''
  }];

  public set: string = 'EVO';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta EVO';
}
