import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [ C ];

  public attacks = [
    { name: 'Low Kick', cost: [F, F], damage: 50, text: '' }
  ];

  public set: string = 'BRS';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';

  public name: string = 'Riolu';
  public fullName: string = 'Riolu BRS';
  
}