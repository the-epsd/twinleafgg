import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class Shelmet extends PokemonCard {

  public tags = [ CardTag.FUSION_STRIKE ];

  public regulationMark = 'E';
    
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.GRASS;
  
  public hp: number = 70;
  
  public weakness = [{ type: CardType.FIRE }];
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Spit Beam',
      cost: [CardType.GRASS],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '13';

  public name: string = 'Shelmet';

  public fullName: string = 'Shelmet FST';

}