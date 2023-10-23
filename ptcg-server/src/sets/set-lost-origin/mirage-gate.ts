import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class MirageGate extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '163';

  public regulationMark = 'F';

  public name: string = 'Mirage Gate';

  public fullName: string = 'Mirage Gate LOR';

  public text: string =
    'You can use this card only if you have 7 or more cards in the Lost Zone.' +
    '' +
    'Search your deck for up to 2 basic Energy cards of different types and attach them to your Pokémon in any way you like. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      if (player.lostzone.cards.length <= 6) {
        throw new GameError (GameMessage.CANNOT_PLAY_THIS_CARD);  
      }
            
      if (player.lostzone.cards.length >= 7) {
        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.deck,
          PlayerType.BOTTOM_PLAYER,
          [ SlotType.BENCH, SlotType.ACTIVE ],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { allowCancel: true, min: 1, max: 2 }
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            return state;
          }});
      }
      return state;
    }
    return state;
  }

}