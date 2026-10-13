import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Huntail extends PokemonCard {
  protected _tags = [CardTag.FUSION_STRIKE];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clamperl';
  public cardType: CardType[] = [W];
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [
    {
      name: 'Single Strike Jammer',
      powerType: PowerType.ABILITY,
      text: "Your opponent's Single Strike Pokémon's attacks cost Colorless more.",
    },
  ];

  public attacks = [
    {
      name: 'Cavernous Chomp',
      cost: [W, C, C],
      damage: 80,
      text: '',
    },
  ];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Huntail';
  public fullName: string = 'Huntail FST 66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Single Strike Jammer
    if (effect instanceof CheckAttackCostEffect) {
      const attackingPlayer = effect.player;
      const attackingPokemon = attackingPlayer.active.getPokemonCard();

      if (!attackingPokemon || !attackingPokemon.hasTag(CardTag.SINGLE_STRIKE)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const abilityOwner = StateUtils.findOwner(state, cardList);

      if (attackingPlayer === abilityOwner) {
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
        attackingPlayer.active,
      )) {
        return state;
      }

      const index = effect.cost.indexOf(CardType.COLORLESS);
      if (index > -1) {
        effect.cost.splice(index, 0, CardType.COLORLESS);
      } else {
        effect.cost.push(CardType.COLORLESS);
      }
    }

    return state;
  }
}
