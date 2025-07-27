import { PokemonCard, Stage, CardType, State, StoreLike, StateUtils, CardTag } from '../../game';
import { AfterDamageEffect, ApplyWeaknessEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Keldeoex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 210;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gale Thrust',
    cost: [W, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokémon moved from the Bench to the Active Spot this turn, this attack does 90 more damage.'
  },
  {
    name: 'Sonic Edge',
    cost: [W, C, C],
    damage: 120,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Keldeo ex';
  public fullName: string = 'Keldeo ex SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof EndTurnEffect && this.movedToActiveThisTurn) {
      this.movedToActiveThisTurn = false;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (this.movedToActiveThisTurn) {
        effect.damage += 120;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 120);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }
    return state;
  }
} 