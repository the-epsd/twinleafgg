import { CardTag, CardType, PokemonCard, Stage } from '../../game';

export class MarniesMorgrem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Marnie\'s Impidimp';
  public tags: CardTag[] = [CardTag.MARNIES];
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    { name: 'Corkscrew Punch', cost: [D, D], damage: 60, text: '' },
  ];

  public regulationMark: string = 'I';
  public set: string = 'DRI';
  public setNumber: string = '135';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marnie\'s Morgrem';
  public fullName: string = 'Marnie\'s Morgrem DRI';
}