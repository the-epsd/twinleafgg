import { CardType, GamePhase, PokemonCard, Stage, State, StoreLike } from '../../game';
import { AddMarkerEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Horn Rush',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If tails, this attack does nothing.'
  },
  {
    name: 'Granite Head',
    cost: [F, C],
    damage: 20,
    text: 'During your opponent\'s next turn, any damage done to Onix by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public set: string = 'TRR';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Onix';
  public fullName: string = 'Onix TRR';

  public readonly BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    // Granite Head
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.BARRIER_ATTACK_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    if (effect instanceof PutDamageEffect
      && effect.source.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 10;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
    }

    return state;
  }
}