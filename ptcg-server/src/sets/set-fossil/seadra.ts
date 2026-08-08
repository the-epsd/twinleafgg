import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Horsea';
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W, C],
    damage: 20,
    text: 'Does 20 damage plus 10 more damage for each [W] Energy attached to Seadra but not used to pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
  }, {
    name: 'Agility',
    cost: [W, C, C],
    damage: 20,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, done to Seadra.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Water Gun (immediate damage math — not a delayed EffectOfAttack)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkCost = new CheckAttackCostEffect(player, this.attacks[0]);
      state = store.reduceEffect(state, checkCost);

      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);

      const waterEnergy = checkEnergy.energyMap.filter(e =>
        e.provides.includes(CardType.WATER));

      const extraWaterEnergy = waterEnergy.length - checkCost.cost.length;

      if (extraWaterEnergy == 1) effect.damage += 10;
      if (extraWaterEnergy == 2) effect.damage += 20;
    }

    // Agility
    // Ref: set-burning-shadows/ledyba.ts (Agility)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
