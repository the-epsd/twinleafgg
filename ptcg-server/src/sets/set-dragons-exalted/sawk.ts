import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Sawk extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Defensive Stance',
      cost: [C],
      damage: 0,
      text: 'Heal 30 damage from this Pokémon. Switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Karate Chop',
      cost: [F, C, C],
      damage: 70,
      damageCalculation: '-' as '-',
      text: 'Does 70 damage minus 10 damage for each damage counter on this Pokémon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sawk';
  public fullName: string = 'Sawk DRX';

  public usedDefensiveStance = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Defensive Stance - heal 30, then switch after attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      this.usedDefensiveStance = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedDefensiveStance) {
      this.usedDefensiveStance = false;
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    if (effect instanceof EndTurnEffect && this.usedDefensiveStance) {
      this.usedDefensiveStance = false;
    }

    // Karate Chop - 70 minus 10 per damage counter on this Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const damageCounters = Math.floor(player.active.damage / 10);
      effect.damage = Math.max(0, 70 - (10 * damageCounters));
    }

    return state;
  }
}
