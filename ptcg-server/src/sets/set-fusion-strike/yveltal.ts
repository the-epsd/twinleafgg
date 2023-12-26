import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class Yveltal extends PokemonCard {

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;
  
  public tags = [ CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.DARK;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Dark Cutter',
      cost: [ CardType.DARK, CardType.DARK ],
      damage: 50,
      text: '   '
    },
    {
      name: 'Single Strike Wings',
      cost: [ CardType.DARK, CardType.DARK, CardType.DARK ],
      damage: 110,
      text: '   '
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '175';

  public name: string = 'Yveltal';

  public fullName: string = 'Yveltal FST';
}