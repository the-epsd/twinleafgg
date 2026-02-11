import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonStatsEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Leavanny extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Swadloon';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Leaf Tailor',
    powerType: PowerType.ABILITY,
    text: 'Each of your Pokémon that has any Energy attached to it has no Weakness.'
  }];

  public attacks = [{
    name: 'Cutting Arm',
    cost: [G, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip 2 coins. This attack does 20 more damage for each heads.'
  }];

  public set: string = 'NVI';
  public setNumber: string = '3';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Leavanny';
  public fullName: string = 'Leavanny NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Leaf Tailor - remove weakness from Pokémon with energy attached
    if (effect instanceof CheckPokemonStatsEffect) {
      // Find who owns this Leavanny and if it's in play
      let leavannyOwner: any = null;

      state.players.forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          if (cardList.getPokemonCard() === this) {
            leavannyOwner = p;
          }
        });
      });

      if (!leavannyOwner) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, leavannyOwner, this)) {
        return state;
      }

      // Check if target is owned by same player
      let targetOwner: any = null;
      state.players.forEach(p => {
        if (p.active === effect.target || p.bench.includes(effect.target)) {
          targetOwner = p;
        }
      });

      if (targetOwner !== leavannyOwner) {
        return state;
      }

      // Check if target has energy attached
      const checkEnergy = new CheckProvidedEnergyEffect(targetOwner, effect.target);
      store.reduceEffect(state, checkEnergy);

      if (checkEnergy.energyMap.length > 0) {
        // Remove weakness
        effect.weakness = [];
      }
    }

    // Cutting Arm - flip 2 coins, +20 per heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads = 0;
        results.forEach(r => { if (r) heads++; });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }
}
