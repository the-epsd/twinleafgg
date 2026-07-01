import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../../game/store/prefabs/prefabs';

export class MegaExcadrillex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Drilbur';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 340;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Dig And Break',
    cost: [M, M],
    damage: 90,
    text: 'Discard the top 2 cards from your opponent\'s deck.',
  },
  {
    name: 'Maximum Drill',
    cost: [M, M, M],
    damage: 200,
    damageCalculation: '+',
    text: 'If this Pokémon has at least 2 extra Energy attached to it (in addition to this attack\'s cost), this attack does 130 more damage.',
  }];

  public set: string = 'M5';
  public setNumber: string = '63';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Excadrill ex';
  public fullName: string = 'Mega Excadrill ex M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-fusion-strike/pangoro.ts (discard top of opponent\'s deck)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, opponent, 2, this, effect);
    }

    // Ref: set-black-bolt-white-flare/jellicent-ex.ts (extra Energy bonus damage)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkCost = new CheckAttackCostEffect(player, this.attacks[1]);
      state = store.reduceEffect(state, checkCost);
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkEnergy);
      const totalEnergy = checkEnergy.energyMap.reduce((sum, em) => sum + em.provides.length, 0);
      const extraEnergy = totalEnergy - checkCost.cost.length;
      if (extraEnergy >= 2) {
        effect.damage += 130;
      }
    }

    return state;
  }
}
