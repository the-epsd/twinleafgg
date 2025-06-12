import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class AurasLucario3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.AURAS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Detect',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  },
  {
    name: 'Quick Attack',
    cost: [M, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];

  public set: string = 'PCGP';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aura\'s Lucario';
  public fullName: string = 'Aura\'s Lucario PCGP 93';

  public readonly DETECT_MARKER = 'DETECT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.DETECT_MARKER, this);
          ADD_MARKER(this.DETECT_MARKER, effect.opponent, this);
        }
      });
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this) {
      if (this.marker.hasMarker(this.DETECT_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.DETECT_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.DETECT_MARKER, effect.player, this);
      this.marker.removeMarker(this.DETECT_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}