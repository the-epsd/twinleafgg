import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardType, EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Player } from '../../../game/store/state/player';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardToHandEffect } from '../../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../../game/store/card/energy-card';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { MOVE_CARDS, SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';

export class FireCrystal extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '173';
  public name: string = 'Fire Crystal';
  public fullName: string = 'Fire Crystal UNB';
  public text: string = 'Put 3 [R] Energy cards from your discard pile into your hand.';

  private countFireEnergyInDiscard(player: Player): number {
    return player.discard.cards.filter(
      (c) =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.FIRE),
    ).length;
  }

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return this.countFireEnergyInDiscard(player) > 0;
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

      // Player has no Fire Energy in the discard pile
      const energyInDiscard = this.countFireEnergyInDiscard(player);
      if (energyInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const max = Math.min(3, energyInDiscard);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: max, max, allowCancel: false },
      );
    }

    return state;
  }
}
