import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player } from '../../../game';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Fisherman extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Fisherman';
  public fullName: string = 'Fisherman CES';
  public text: string = 'Put 4 basic Energy cards from your discard pile into your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    // Need at least 1 basic Energy card in the discard pile
    if (!player.discard.cards.some((c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Check if DiscardToHandEffect is prevented
      const discardEffect = new DiscardToHandEffect(player, this);
      store.reduceEffect(state, discardEffect);
      if (discardEffect.preventDefault) {
        return state;
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const basicEnergies = player.discard.cards.filter(
        (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
      ).length;

      if (basicEnergies === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const amount = Math.min(basicEnergies, 4);

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: amount, max: amount, allowCancel: false },
      );
    }

    return state;
  }
}
