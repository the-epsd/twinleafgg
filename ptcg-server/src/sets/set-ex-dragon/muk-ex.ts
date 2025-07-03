import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Mukex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Grimer';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Toxic Gas',
    powerType: PowerType.POKEBODY,
    text: 'As long as Muk ex is your Active Pokémon, ignore all Poké-Powers and Poké-Bodies other than Toxic Gas.'
  }];

  public attacks = [{
    name: 'Poison Breath',
    cost: [G],
    damage: 10,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Slimy Water',
    cost: [G, G, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Does 40 damage plus 10 more damage for each [C] Energy in the Defending Pokémon\'s Retreat Cost (after applying effects to the Retreat Cost).'
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Muk ex';
  public fullName: string = 'Muk ex DR';

  public usedPoisonSpurt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Toxic Gas
    if (effect instanceof PowerEffect && (effect.power.powerType === PowerType.POKEPOWER || effect.power.powerType === PowerType.POKEBODY) && effect.power.name !== 'Toxic Gas') {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Muk is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

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