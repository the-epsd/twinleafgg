import { Card } from '../../game/store/card/card';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyPrompt, ChooseCardsPrompt, PlayerType, SlotType } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Raihan, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  
  // No Pokemon KO last turn
  if (!player.marker.hasMarker(self.RAIHAN_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
    if (!isBasicEnergy) {
      blocked.push(index);
    }
  });
  
  // We will discard this card after prompt confirmation
  // This will prevent unblocked supporter to appear in the discard pile
  effect.preventDefault = true;
  
  return store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.discard,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    {superType: SuperType.ENERGY, energyType: EnergyType.BASIC},
    {allowCancel: false, min: 1, max: 1}
  ), transfers => {
    if (transfers && transfers.length > 0) {
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.discard.moveCardTo(transfer.card, target);
      }
    
  
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        {min: 1, max: 1, allowCancel: false}
      ), selected => {
        cards = selected || [];
        next();
      
  
        player.hand.moveCardTo(self, player.supporter);
        player.deck.moveCardsTo(cards, player.hand);
  
  
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  });
}

export class Raihan extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '152';

  public regulationMark = 'E';

  public name: string = 'Raihan';

  public fullName: string = 'Raihan EVS';

  public text: string =
    'You can play this card only if 1 of your Pokemon was Knocked Out ' +
    'during your opponent\'s last turn. Search your deck for a Pokemon, ' +
    'a Trainer card, and a basic Energy card, reveal them, and put them ' +
    'into your hand. Then, shuffle your deck.';

  public readonly RAIHAN_MARKER = 'RAIHAN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.RAIHAN_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RAIHAN_MARKER);
    }

    return state;
  }

}