import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AddMarkerEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class Scizorex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scyther';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Danger Perception',
    powerType: PowerType.POKEBODY,
    text: 'As long as Scizor ex\'s remaining HP is 60 or less, Scizor ex does 40 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Steel Wing',
    cost: [M, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done to Scizor ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Cross-Cut',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 50 damage plus 30 more damage.'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Scizor ex';
  public fullName: string = 'Scizor ex UF';

  public readonly STEEL_WING_MARKER = 'STEEL_WING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) { return state; }

      const checkHpEffect = new CheckHpEffect(player, effect.source);
      store.reduceEffect(state, checkHpEffect);

      const attack = effect.attack;
      if (attack && attack.damage > 0 && effect.target === opponent.active && checkHpEffect.hp <= 60) {
        console.log(effect.source.hp, effect.source.damage);
        effect.damage += 40;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.STEEL_WING_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect
      && effect.source.marker.hasMarker(this.STEEL_WING_MARKER, this)) {

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 20;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.STEEL_WING_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemons().length > 1) {
        effect.damage += 30;
      }
    }

    return state;
  }
}