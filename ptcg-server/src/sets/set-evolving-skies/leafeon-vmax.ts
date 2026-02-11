import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, StateUtils } from '../../game';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class LeafeonVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Leafeon V';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 310;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public tags = [CardTag.POKEMON_VMAX];

  public attacks = [
    {
      name: 'Grass Knot',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 60,
      damageCalculation: 'x',
      text: 'This attack does 60 damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
    },
    {
      name: 'Max Leaf',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 170,
      text: 'Heal 30 damage from this Pokémon.'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '8';

  public name: string = 'Leafeon VMAX';

  public fullName: string = 'Leafeon VMAX EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkRetreatCostEffect = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreatCostEffect);

      const retreatCost = checkRetreatCostEffect.cost.length;
      effect.damage = retreatCost * 60;

      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);

      return state;
    }
    return state;
  }
}