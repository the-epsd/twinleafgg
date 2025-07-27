import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';

export class Drillbur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Corkscrew Punch',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Drillbur';
  public fullName: string = 'Drillbur SV11B';
} 