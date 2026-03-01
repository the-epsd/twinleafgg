import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase } from '../../game/store/state/state';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Deoxys3 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public readonly PSY_PROTECT_MARKER = 'DEOXYS3_PSY_PROTECT_MARKER';
  public readonly CLEAR_PSY_PROTECT_MARKER = 'DEOXYS3_CLEAR_PSY_PROTECT_MARKER';

  public attacks = [
    {
      name: 'Psy Protect',
      cost: [P, P, C],
      damage: 80,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokemon from attacks from your opponent\'s Pokemon that have any Abilities.'
    }
  ];

  public regulationMark: string = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Deoxys';
  public fullName: string = 'Deoxys M4 33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack: Psy Protect - set markers for "during opponent's next turn"
    // Ref: set-steam-siege/seedot.ts (2-marker pattern for opponent's next turn)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.PSY_PROTECT_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_PSY_PROTECT_MARKER, this);
    }

    // Prevent damage from Pokemon with Abilities (during opponent's next turn)
    // Ref: set-twilight-masquerade/cornerstone-mask-ogerpon-ex.ts (prevent damage from source with ability)
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      const defender = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, defender, this)) {
        return state;
      }
      if (!effect.target.marker.hasMarker(this.PSY_PROTECT_MARKER, this)) {
        return state;
      }
      const sourceCard = effect.source.getPokemonCard();
      if (!sourceCard || !sourceCard.powers.some(p => p.powerType === PowerType.ABILITY)) {
        return state;
      }
      effect.damage = 0;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      const defender = StateUtils.findOwner(state, effect.target);
      if (IS_ABILITY_BLOCKED(store, state, defender, this)) {
        return state;
      }
      if (!effect.target.marker.hasMarker(this.PSY_PROTECT_MARKER, this)) {
        return state;
      }
      const sourceCard = effect.source.getPokemonCard();
      if (!sourceCard || !sourceCard.powers.some(p => p.powerType === PowerType.ABILITY)) {
        return state;
      }
      effect.preventDefault = true;
    }

    // Cleanup at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_PSY_PROTECT_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_PSY_PROTECT_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PSY_PROTECT_MARKER, this);
      });
    }

    return state;
  }
}
