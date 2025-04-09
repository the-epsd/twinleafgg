import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { BeginTurnEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Donphan extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Phanpy';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sturdy',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP and would be Knocked Out by damage from an attack, this Pokémon is not Knocked Out and its remaining HP becomes 10.'
  }];

  public attacks = [{
    name: 'Rolling Spin',
    cost: [F, C, C],
    damage: 70,
    text: 'During your next turn, this Pokémon\'s Rolling Spin attack does 70 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Donphan';
  public fullName: string = 'Donphan LOT';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public usedAttack: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.damage == 0) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {

        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }

        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
      }
    }

    if (effect instanceof AttackEffect) {
      this.usedAttack = true;
    }

    if (effect instanceof BeginTurnEffect) {
      if (this.usedAttack) {
        this.usedAttack = false;
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (!this.usedAttack) {
        this.usedAttack = false;
        REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
        REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
      ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Check marker
      if (HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
        effect.damage += 70;
      }
      ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
    }
    return state;
  }
}