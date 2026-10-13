import { State, StateUtils, StoreLike } from '../../../game';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Azumarill extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Marill';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Froth',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Azumarill from your hand to evolve 1 of your Active Pokémon, you may use this power. Each Defending Pokémon is now Paralyzed.',
  }];

  public attacks = [{
    name: 'Water Punch',
    cost: [W, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin for each [W] Energy attached to Azumarill. This attack does 20 damage plus 20 more damage for each heads.',
  }];

  public set: string = 'TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Azumarill';
  public fullName: string = 'Azumarill TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Froth
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this) && effect.target === effect.player.active) {
      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.PARALYZED],
          );
        }
      });
    }

    // Water Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let waterEnergyCount = 0;
      checkProvidedEnergy.energyMap.forEach(energy => {
        if (energy.provides.includes(CardType.WATER) || energy.provides.includes(CardType.ANY)) {
          waterEnergyCount++;
        }
      });

      if (waterEnergyCount === 0) {
        return state;
      }

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, waterEnergyCount, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 + (20 * heads);
      });
    }

    return state;
  }
}
