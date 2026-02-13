import { SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, CoinFlipPrompt, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class EnergyPickup extends TrainerCard {

  public superType = SuperType.TRAINER;
  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '132';
  public name: string = 'Energy Pickup';
  public fullName: string = 'Energy Pickup LA';

  public text = 'Flip a coin. If heads, search your discard pile for a basic Energy card and attach it to 1 of your Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC;
      });
      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (!result) {
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          return state;
        }
        if (result === true) {

          const player = effect.player;

          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 1, max: 1 }
          ), transfers => {
            transfers = transfers || [];
            // cancelled by user
            if (transfers.length === 0) {
              player.supporter.moveCardTo(effect.trainerCard, player.discard);
              return;
            }
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
              player.supporter.moveCardTo(effect.trainerCard, player.discard);
            }
          });

          return state;
        }
        return state;
      });
    }
    return state;
  }

}
