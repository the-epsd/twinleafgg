import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard, StoreLike, State, StateUtils, PowerType } from '../../../game';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { GamePhase } from '../../../game/store/state/state';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Garbodor extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Trubbish';
  public hp: number = 140;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Gloomy Garbage',
      powerType: PowerType.ABILITY,
      text: "Attacks used by your opponent's Active Pokémon that has a Pokémon Tool attached do 20 less damage (before applying Weakness and Resistance).",
    },
  ];
  public attacks = [
    {
      name: 'Sludge Bomb',
      cost: [D, D, C],
      damage: 100,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Garbodor';
  public fullName: string = 'Garbodor M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gloomy Garbage
    if (
      effect instanceof DealDamageEffect &&
      effect.damage > 0 &&
      state.phase === GamePhase.ATTACK
    ) {
      const attackerOwner = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, attackerOwner);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      // Opponent's Active with a Tool
      if (attackerOwner.active !== effect.source || effect.source.tools.length === 0) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        effect.source,
      )) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }
}
