import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { GUST_OPPONENT_BENCHED_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Gorebyss extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clamperl';
  public hp: number = 80;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [];

  public attacks = [{
    name: 'Sweet Temptation',
    cost: [],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. This attack does 10 damage to the new Defending Pokémon.'
  },
  {
    name: 'Psychic Snap',
    cost: [W, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If Gorebyss has any Psychic Energy attached to it, this attack does 30 damage plus 20 more damage and the Defending Pokémon is now Confused.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Gorebyss';
  public fullName: string = 'Gorebyss GE';

  public usedSweetTemptation = false;
  private sweetTemptationAttack: AttackEffect | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sweet Temptation
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        this.usedSweetTemptation = true;
        this.sweetTemptationAttack = effect;
        GUST_OPPONENT_BENCHED_POKEMON(store, state, effect.player);
      }
    }

    if (effect instanceof AfterAttackEffect && this.usedSweetTemptation && this.sweetTemptationAttack) {
      this.usedSweetTemptation = false;
      const attackEffect = this.sweetTemptationAttack;
      this.sweetTemptationAttack = undefined;
      const opponent = StateUtils.getOpponent(state, effect.player);
      const putDamage = new PutDamageEffect(attackEffect, 10);
      putDamage.target = opponent.active;
      store.reduceEffect(state, putDamage);
    }

    if (effect instanceof EndTurnEffect) {
      this.usedSweetTemptation = false;
      this.sweetTemptationAttack = undefined;
    }

    // Psychic Snap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkEnergy);
      const hasPsychic = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.PSYCHIC) || em.provides.includes(CardType.ANY)
      );
      if (hasPsychic) {
        effect.damage += 20;
        effect.opponent.active.addSpecialCondition(SpecialCondition.CONFUSED);
      }
    }

    return state;
  }
}
