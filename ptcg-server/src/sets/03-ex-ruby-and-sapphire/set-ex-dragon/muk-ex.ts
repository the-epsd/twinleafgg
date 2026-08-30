import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import {
  CAN_APPLY_LOCKER_ABILITY,
  HANDLE_ABILITY_BLOCK,
  IS_ABILITY_LOCKER_ACTIVE,
  POKEPOWER_AND_BODY_TYPES,
} from '../../../game/store/prefabs/ability-lock';
import { GameMessage } from '../../../game/game-message';

export class Mukex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  protected _tags = [CardTag.POKEMON_ex];
  public cardType: CardType[] = [G];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Toxic Gas',
      powerType: PowerType.POKEBODY,
      text: 'As long as Muk ex is your Active Pokémon, ignore all Poké-Powers and Poké-Bodies other than Toxic Gas.',
    },
  ];

  public attacks = [
    {
      name: 'Poison Breath',
      cost: [G],
      damage: 10,
      text: 'The Defending Pokémon is now Poisoned.',
    },
    {
      name: 'Slimy Water',
      cost: [G, G, C],
      damage: 40,
      damageCalculation: '+',
      text: "Does 40 damage plus 10 more damage for each [C] Energy in the Defending Pokémon's Retreat Cost (after applying effects to the Retreat Cost).",
    },
  ];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Muk ex';
  public fullName: string = 'Muk ex DR';

  public usedPoisonSpurt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(
      effect,
      ({ player }) => {
        if (!IS_ABILITY_LOCKER_ACTIVE(state, player, this)) {
          return false;
        }
        return CAN_APPLY_LOCKER_ABILITY(store, state, player, this, this.powers[0]);
      },
      {
        powerTypes: POKEPOWER_AND_BODY_TYPES,
        exemptPowerNames: ['Toxic Gas'],
        error: GameMessage.BLOCKED_BY_ABILITY,
      },
    );

    // Poison Breath
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedPoisonSpurt = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedPoisonSpurt === true) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (effect instanceof EndTurnEffect && this.usedPoisonSpurt) {
      this.usedPoisonSpurt = false;
    }

    // Slimy Water
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive) {
        const checkRetreatCostEffect = new CheckRetreatCostEffect(opponent);
        store.reduceEffect(state, checkRetreatCostEffect);
        const retreatCost = checkRetreatCostEffect.cost.length;

        effect.damage += retreatCost * 10;
      }
    }

    return state;
  }
}
