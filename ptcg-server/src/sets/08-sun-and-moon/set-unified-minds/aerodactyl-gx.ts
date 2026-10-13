import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class AerodactylGx extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  protected _tags = [CardTag.POKEMON_GX];
  public evolvesFrom: string = 'Unidentified Fossil';
  public hp: number = 210;
  public cardType: CardType[] = [F];
  public weakness = [{ type: G }];
  public retreat = [];

  public powers = [{
    name: 'Primal Winds',
    powerType: PowerType.ABILITY,
    text: "As long as this Pokémon is your Active Pokémon, your opponent's Basic Pokémon's attacks cost [C] more.",
  }];

  public attacks = [{
    name: 'Boulder Crush',
    cost: [F, C, C],
    damage: 120,
    text: '',
  },
  {
    name: 'Wild Dive-GX',
    cost: [F],
    damage: 50,
    damageCalculation: 'x',
    text: "This attack does 50 damage times the amount of Energy attached to your opponent's Active Pokémon. (You can't use more than 1 GX attack in a game.)",
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Aerodactyl-GX';
  public fullName: string = 'Aerodactyl-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primal Winds
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      const attackingPokemon = player.active.getPokemonCard();
      if (attackingPokemon && attackingPokemon.stage === Stage.BASIC) {
        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          opponent,
          this.powers[0],
          this,
          player.active,
        )) {
          return state;
        }
        effect.cost.push(CardType.COLORLESS);
      }
    }

    // Wild Dive-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const checkEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      store.reduceEffect(state, checkEnergy);
      let energyCount = 0;
      checkEnergy.energyMap.forEach((em) => {
        energyCount += em.provides.length;
      });
      effect.damage = 50 * energyCount;
    }

    return state;
  }
}
