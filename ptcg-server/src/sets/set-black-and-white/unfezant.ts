import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Unfezant extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Tranquill';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fly',
      cost: [C, C],
      damage: 50,
      text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Cutting Wind',
      cost: [C, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Unfezant';
  public fullName: string = 'Unfezant BLW';

  private readonly PREVENT_ALL_MARKER = 'PREVENT_ALL_DAMAGE_AND_EFFECTS_UNFEZANT';
  private readonly CLEAR_PREVENT_ALL_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_AND_EFFECTS_UNFEZANT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Fly
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          effect.damage = 0;
        } else {
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
