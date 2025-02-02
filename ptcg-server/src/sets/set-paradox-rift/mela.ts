import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyCard } from '../../game/store/card/energy-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyPrompt, PlayerType, SlotType } from '../../game';

function* playCard(next: Function, store: StoreLike, state: State,
  self: Mela, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  const supporterTurn = player.supporterTurn;

  if (supporterTurn > 0) {
    throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
  }

  // No Pokemon KO last turn
  if (!player.marker.hasMarker(self.MELA_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const hasEnergyInDiscard = player.discard.cards.some(c => {
    return c instanceof EnergyCard && c.name === 'Fire Energy';
  });
  if (!hasEnergyInDiscard) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const blocked: number[] = [];
  player.discard.cards.forEach((c, index) => {
    const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.FIRE);
    if (!isBasicEnergy) {
      blocked.push(index);
    }
  });

  // We will discard this card after prompt confirmation
  player.hand.moveCardTo(effect.trainerCard, player.supporter);
  // This will prevent unblocked supporter to appear in the discard pile
  effect.preventDefault = true;


  return store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.discard,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.ACTIVE, SlotType.BENCH],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
    { allowCancel: false, min: 1, max: 1 }
  ), transfers => {
    if (transfers && transfers.length > 0) {
      for (const transfer of transfers) {
        const target = StateUtils.getTarget(state, player, transfer.to);
        player.discard.moveCardTo(transfer.card, target);
      }
    }

    player.supporter.moveCardTo(effect.trainerCard, player.discard);

    while (player.hand.cards.length < 6) {
      if (player.deck.cards.length === 0) {
        break;
      }
      player.deck.moveTo(player.hand, 1);
    }
    return state;
  });
}

export class Mela extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '167';

  public regulationMark = 'G';

  public name: string = 'Mela';

  public fullName: string = 'Mela PAR';

  public text: string =
    'You can use this card only if any of your Pokémon were Knocked Out during your opponent\'s last turn.' +
    '' +
    'Attach a Basic R Energy card from your discard pile to 1 of your Pokémon. If you do, draw cards until you have 6 cards in your hand.';

  public readonly MELA_MARKER = 'MELA_MARKER';

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
        effect.player.marker.addMarker(this.MELA_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.MELA_MARKER);
    }

    return state;
  }

}