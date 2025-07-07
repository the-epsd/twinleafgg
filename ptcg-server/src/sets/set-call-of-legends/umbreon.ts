import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddSpecialConditionsEffect, PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Umbreon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Moonlight Fang',
    cost: [D],
    damage: 30,
    text: 'During your opponent\'s next turn, prevent all effects, including damage, done to Umbreon by attacks from your opponent\'s Pokémon that has any Poké-Powers or Poké-Bodies.'
  },
  {
    name: 'Quick Blow',
    cost: [D, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
  }];

  public set: string = 'CL';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Umbreon';
  public fullName: string = 'Umbreon CL';

  public readonly MOONLIGHT_FANG_MARKER = 'MOONLIGHT_FANG_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.marker.addMarker(this.MOONLIGHT_FANG_MARKER, this);
      ADD_MARKER(this.MOONLIGHT_FANG_MARKER, effect.opponent, this);
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect || effect instanceof AddSpecialConditionsEffect)
      && effect.target.getPokemonCard() === this
      && effect.source.getPokemonCard()?.powers.some(power => (power.powerType === PowerType.POKEBODY || power.powerType === PowerType.POKEPOWER))
      && (state.phase === GamePhase.ATTACK || state.phase === GamePhase.AFTER_ATTACK)) {

      if (this.marker.hasMarker(this.MOONLIGHT_FANG_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.MOONLIGHT_FANG_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.MOONLIGHT_FANG_MARKER, effect.player, this);
      this.marker.removeMarker(this.MOONLIGHT_FANG_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 30);
    }

    return state;
  }
}