import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Vibrava2 extends PokemonCard {
  public tags = [CardTag.DELTA_SPECIES];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: C }];
  public resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Psychic Wing',
    powerType: PowerType.POKEBODY,
    text: 'If Vibrava has any [P] Energy attached to it, the Retreat Cost for Vibrava is 0.'
  }];

  public attacks = [{
    name: 'Quick Blow',
    cost: [C, C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava DF 24';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasPsychicEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.PSYCHIC) || energy.provides.includes(CardType.ANY)
      );

      if (hasPsychicEnergy) {
        effect.cost = [];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}