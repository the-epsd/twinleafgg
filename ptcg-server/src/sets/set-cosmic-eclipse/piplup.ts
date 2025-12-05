import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Bubble Hold',
    cost: [W, W, W],
    damage: 80,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Piplup';
  public fullName: string = 'Piplup CEC';

  public readonly BUBBLE_HOLD_MARKER = 'BUBBLE_HOLD_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bubble Hold attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        opponent.active.marker.addMarker(this.BUBBLE_HOLD_MARKER, this);
        opponent.marker.addMarker(this.BUBBLE_HOLD_MARKER, this);
      }
    }

    // Block attacks when marker is present
    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Clean up markers at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
      effect.player.marker.removeMarker(this.BUBBLE_HOLD_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.BUBBLE_HOLD_MARKER, this)) {
          cardList.marker.removeMarker(this.BUBBLE_HOLD_MARKER, this);
        }
      });
    }

    return state;
  }
}

