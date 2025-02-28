import { CardType, PokemonCard, Stage } from '../../game';

export class Pawmi extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    { name: 'Light Punch', cost: [C], damage: 10, text: '' },
    { name: 'Zap Kick', cost: [L, C], damage: 20, text: '' },
  ];

  public set: string = 'SVI';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Pawmi';
  public fullName: string = 'Pawmi SVI';

}