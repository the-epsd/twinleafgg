import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Solosis extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 30;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Hide',
      cost: [P],
      damage: 0,
      text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Solosis';
  public fullName: string = 'Solosis PLB';

  private readonly PREVENT_ALL_MARKER = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_SOLOSIS';
  private readonly CLEAR_PREVENT_ALL_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_SOLOSIS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack: Hide
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          player.active.marker.addMarker(this.PREVENT_ALL_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_PREVENT_ALL_MARKER, this);
        }
      });
    }

    // Prevent all damage and effects
    if ((effect instanceof PutDamageEffect || effect instanceof DealDamageEffect || effect instanceof AddSpecialConditionsEffect)
      && effect.target.cards.includes(this)
      && effect.target.marker.hasMarker(this.PREVENT_ALL_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }

    // Cleanup at end of opponent's turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_PREVENT_ALL_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_PREVENT_ALL_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_ALL_MARKER, this);
      });
    }

    return state;
  }
}
