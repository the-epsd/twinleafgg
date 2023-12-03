import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Registeel extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;
  
  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Regi Gate',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Heavy Slam',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 220,
      text: 'This attack does 50 less damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public set2: string = 'astralradiance';

  public setNumber: string = '108';

  public name: string = 'Registeel';

  public fullName: string = 'Registeel ASR';

  //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

  //     if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
  //       const player = effect.player;
  //       const opponent = state.getOpponent(player);

  //       let retreatCost = 0;
  //       if (opponent.active) {
  //         retreatCost = opponent.active.getRetreatCost();
  //       }

  //       effect.damage -= retreatCost * 50;
  //       if (effect.damage < 0) {
  //         effect.damage = 0;
  //       }
  //     }

//     return state;
//   }
}