import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class AurasLucario extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Iron Defense',
    cost: [M],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to Aura\'s Lucario during your opponent\'s next turn.'
  },
  {
    name: 'Low Kick',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'PCGP';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 75';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';

  public readonly IRON_DEFENSE_MARKER = 'IRON_DEFENSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.IRON_DEFENSE_MARKER, this);
          ADD_MARKER(this.IRON_DEFENSE_MARKER, effect.opponent, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && HAS_MARKER(this.IRON_DEFENSE_MARKER, effect.target, this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.preventDefault = true;
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.IRON_DEFENSE_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.IRON_DEFENSE_MARKER, effect.player, this);
      this.marker.removeMarker(this.IRON_DEFENSE_MARKER, this);
    }

    return state;
  }

}
