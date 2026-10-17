import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType, CardTag } from '../../../game/store/card/card-types';
import {
  PlayerType,
  StoreLike,
  State,
  StateUtils,
  GameError,
  GameMessage,
  Player,
} from '../../../game';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class LusaminePrismStar extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  protected _tags = [CardTag.PRISM_STAR];
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '182';
  public name: string = 'Lusamine Prism Star';
  public fullName: string = 'Lusamine \u25c7 LOT';
  public text: string =
    'You can play this card only if your opponent has exactly 3 Prize cards remaining.\n\n' +
    "Prevent all damage done to your Ultra Beasts by attacks during your opponent's next turn.";

  public readonly PREVENT_DAMAGE_MARKER = 'LUSAMINE_PRISM_PREVENT_DAMAGE';
  public readonly CLEAR_PREVENT_DAMAGE_MARKER = 'LUSAMINE_PRISM_CLEAR_PREVENT_DAMAGE';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    return opponent.getPrizeLeft() === 3;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() !== 3) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Mark all Ultra Beasts for protection
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.hasTag(CardTag.ULTRA_BEAST)) {
          cardList.marker.addMarker(this.PREVENT_DAMAGE_MARKER, this);
        }
      });
      opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_MARKER, this);
    }

    // Prevent all damage to Ultra Beasts with marker (DealDamageEffect for active, PutDamageEffect for bench)
    if (
      effect instanceof DealDamageEffect &&
      effect.target.marker.hasMarker(this.PREVENT_DAMAGE_MARKER, this)
    ) {
      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.hasTag(CardTag.ULTRA_BEAST)) {
        effect.damage = 0;
        return state;
      }
    }

    if (
      effect instanceof PutDamageEffect &&
      effect.target.marker.hasMarker(this.PREVENT_DAMAGE_MARKER, this)
    ) {
      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.hasTag(CardTag.ULTRA_BEAST)) {
        effect.preventDefault = true;
        return state;
      }
    }

    // Cleanup
    if (
      effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_MARKER, this)
    ) {
      effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_DAMAGE_MARKER, this);
      });
    }

    return state;
  }
}
