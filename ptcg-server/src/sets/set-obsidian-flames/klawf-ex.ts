import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game';


export class Klawfex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [ {type: CardType.GRASS} ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Counterattacking Pincer',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
    }
  ];

  public attacks = [{
    name: 'Falling Press',
    cost: [ CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Klawf ex';

  public fullName: string = 'Klawf ex OBF';

  //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    
//     if (effect instanceof AfterDamageEffect)
}