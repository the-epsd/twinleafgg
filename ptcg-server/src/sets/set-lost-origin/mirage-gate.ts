import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, AttachEnergyPrompt, PlayerType, SlotType, StateUtils, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

function* playCard(next: Function, store: StoreLike, state: State, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }
  
  if (player.lostzone.cards.length <= 6) {
    throw new GameError (GameMessage.CANNOT_PLAY_THIS_CARD);  
  }

  if (player.lostzone.cards.length >= 7) {

    // Do not discard the card yet
    effect.preventDefault = true;

    yield store.prompt(state, new AttachEnergyPrompt(
      player.id,
      GameMessage.ATTACH_ENERGY_TO_BENCH,
      player.deck,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
      { allowCancel: false, min: 0, max: 2 }
    ), transfers => {
      transfers = transfers || [];
      for (const transfer of transfers) {

        if (transfers.length > 1) {
          if (transfers[0].card.name === transfers[1].card.name) {
            throw new GameError (GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);  
          }
        }

        const target = StateUtils.getTarget(state, player, transfer.to);
        player.deck.moveCardTo(transfer.card, target); 
        next();
      }
    });
    player.supporter.moveCardTo(effect.trainerCard, player.discard);
    return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
      player.deck.applyOrder(order);

    });
  }
}

export class MirageGate extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

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
      const generator = playCard(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
  
}
  
