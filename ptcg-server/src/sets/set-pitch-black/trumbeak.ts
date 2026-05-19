import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Trumbeak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikipek';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Fly',
    cost: [C],
    damage: 30,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage and effects of attacks done to this Pokémon. If tails, this attack fails.',
  }];

  public set: string = 'M5';
  public setNumber: string = '65';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Trumbeak';
  public fullName: string = 'Trumbeak M5';

  public readonly FLY_MARKER = 'M5_TRUMBEAK_FLY';
  public readonly CLEAR_FLY_MARKER = 'M5_TRUMBEAK_CLEAR_FLY';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-evolutions/chansey.ts (Scrunch), set-lost-thunder/phanpy.ts (flip tails does nothing with printed damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, heads => {
        if (!heads) {
          effect.damage = 0;
          return state;
        }
        player.active.marker.addMarker(this.FLY_MARKER, this);
        opponent.marker.addMarker(this.CLEAR_FLY_MARKER, this);
        return state;
      });
    }

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect)
      && effect.target.marker.hasMarker(this.FLY_MARKER, this)) {
      effect.preventDefault = true;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_FLY_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_FLY_MARKER, this);
      const opp = StateUtils.getOpponent(state, effect.player);
      opp.forEachPokemon(PlayerType.TOP_PLAYER, cardList =>
        cardList.marker.removeMarker(this.FLY_MARKER, this)
      );
    }

    return state;
  }
}
