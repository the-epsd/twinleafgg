import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { SpecialCondition, Stage, CardType } from '../../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../../game/store/prefabs/attack-effects';

export class Heatran extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 140;
  public weakness = [{ type: W }];
  public retreat = [C, C, C, C];

  public readonly LAVA_WALL_MARKER = 'M5_HEATRAN_LAVA_WALL';
  public readonly CLEAR_LAVA_WALL = 'M5_HEATRAN_CLEAR_LAVA';

  public attacks = [{
    name: 'Singe',
    cost: [R],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Burned.',
  },
  {
    name: 'Lava Wall',
    cost: [R, R, C],
    damage: 120,
    text: 'During your opponent\'s next turn, this Pokémon doesn\'t take damage from attacks by Pokémon that are Burned.',
  }];

  public set: string = 'M5';
  public setNumber: string = '7';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Heatran';
  public fullName: string = 'Heatran M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }
    // Ref: set-astral-radiance/glaceon.ts (Frost Wall — 2-marker + opponent-clear pattern)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.LAVA_WALL_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_LAVA_WALL, this);
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && effect.target.marker.hasMarker(this.LAVA_WALL_MARKER, this)
      && effect.source.getPokemonCard() !== undefined) {
      const burnOnAttacker =
        effect.source.specialConditions.includes(SpecialCondition.BURNED);
      if (burnOnAttacker) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_LAVA_WALL, this)) {
      effect.player.marker.removeMarker(this.CLEAR_LAVA_WALL, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.LAVA_WALL_MARKER, this);
      });
    }

    return state;
  }
}
