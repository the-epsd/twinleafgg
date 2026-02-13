import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wurmple';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Harden',
      cost: [C],
      damage: 0,
      text: 'During your opponent\'s next turn, if this Pokemon would be damaged by an attack, prevent that attack\'s damage done to this Pokemon if that damage is 60 or less.'
    },
    {
      name: 'Bug Bite',
      cost: [G, C, C],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Silcoon';
  public fullName: string = 'Silcoon DRX';

  public readonly HARDEN_MARKER = 'SILCOON_HARDEN_MARKER';
  public readonly CLEAR_HARDEN_MARKER = 'SILCOON_CLEAR_HARDEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Harden - prevent damage of 60 or less
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.HARDEN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_HARDEN_MARKER, this);
    }

    // Prevent damage of 60 or less
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.HARDEN_MARKER, this) && effect.damage <= 60) {
        effect.preventDefault = true;
        return state;
      }
    }

    // Cleanup markers at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_HARDEN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_HARDEN_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.HARDEN_MARKER, this);
      });
    }

    return state;
  }
}
