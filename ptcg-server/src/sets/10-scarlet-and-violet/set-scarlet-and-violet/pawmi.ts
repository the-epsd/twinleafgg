import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pawmi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Light Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Zap Kick',
    cost: [L, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '74';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawmi';
  public fullName: string = 'Pawmi SVI';
}
