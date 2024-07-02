import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { Card, ChooseCardsPrompt, GameError, GameMessage } from '../../game';

export class Grant extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public name: string = 'Grant';

  public fullName: string = 'Grant ASR';

  public text: string =
    'During this turn, your [F] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).' +
    ''+
    'During your turn, if this Grant is in your discard pile, you may discard 2 cards, except any Grant, from your hand. If you do, put this Grant into your hand. (This effect doesn\'t use up your Supporter card for the turn.)';

  private readonly GRANT_MARKER = 'GRANT_MARKER';

  public readonly RETURN_TO_HAND_MARKER = 'RETURN_TO_HAND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
        
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.marker.addMarker(this.GRANT_MARKER, this);
      if (effect instanceof DealDamageEffect) {
        const marker = effect.player.marker;
        if (marker.hasMarker(this.GRANT_MARKER, this) && effect.damage > 0) {
          effect.damage += 30;
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          player.supporterTurn += 1;
        }

        // Check if card is in the discard
        if (player.discard.cards.includes(this) === false) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }
    
        // Power already used
        if (player.marker.hasMarker(this.RETURN_TO_HAND_MARKER, this)) {
          throw new GameError(GameMessage.POWER_ALREADY_USED);
        }

        let cards: Card[] = [];
      
        return store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          {},
          { min: 2, max: 2, allowCancel: true }
        ), selected => {
          cards = selected || [];
      
          // Operation canceled by the user
          if (cards.length === 0) {
            return state;
          }
          player.marker.addMarker(this.RETURN_TO_HAND_MARKER, this);
          player.hand.moveCardsTo(cards, player.discard);
          player.discard.moveCardTo(this, player.hand);

        });
      }
    
      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.RETURN_TO_HAND_MARKER, this);
      }

      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.GRANT_MARKER, this);
        return state;
      }

      return state;
    }
    return state;
  }
}
