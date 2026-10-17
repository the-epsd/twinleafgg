import {
  PokemonCard,
  Stage,
  CardType,
  PowerType,
  StoreLike,
  State,
  StateUtils,
  CardTag,
} from '../../../game';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Spidopsex extends PokemonCard {
  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_1;

  protected _tags = [CardTag.POKEMON_ex];
  public cardType: CardType[] = [CardType.GRASS];

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public evolvesFrom = 'Tarountula';

  public powers = [
    {
      name: 'Trap Territory',
      powerType: PowerType.ABILITY,
      text: "Your opponent's Active Pokémon's Retreat Cost is [C] more.",
    },
  ];

  public attacks = [
    {
      name: 'Wire Hang',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 90,
      damageCalculation: '+',
      text: "This attack does 30 more damage for each [C] in your opponent's Active Pokémon's Retreat Cost.",
    },
  ];

  public set: string = 'SVI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Spidops ex';

  public fullName: string = 'Spidops ex SVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
      )) {
        return state;
      }

      effect.cost.push(CardType.COLORLESS);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActiveCard = opponent.active.getPokemonCard();
      if (opponentActiveCard) {
        const retreatCost = opponentActiveCard.retreat.filter(
          (c) => c === CardType.COLORLESS,
        ).length;

        effect.damage += retreatCost * 30;
      }
      return state;
    }

    return state;
  }
}
