import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Lycanroc extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Rockruff';
  public hp: number = 130;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Counter',
    cost: [F],
    damage: 10,
    damageCalculation: '+',
    text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
  },
  {
    name: 'Boulder Crush',
    cost: [F, F],
    damage: 80,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Lycanroc';
  public fullName: string = 'Lycanroc 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counter
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const activeCard = effect.player.active.getPokemonCard();
      if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
        effect.damage += activeCard.damageTakenLastTurn;
      }
    }

    return state;
  }
}
