import { AttachEnergyPrompt, CardList, EnergyCard, GameError, GameMessage, PlayerType, ShowCardsPrompt, SlotType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Ether extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '121';

  public name: string = 'Ether';

  public fullName: string = 'Ether PLS';

  public text = 'Reveal the top card of your deck. If that card is a basic Energy card, attach it to 1 of your Pokémon. If it is not a basic Energy card, return it to the top of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const temp = new CardList();

      player.deck.moveTo(temp, 1); 

      store.prompt(state, new ShowCardsPrompt(
        opponent.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        temp.cards), () => state
      );

      // Check if any cards drawn are basic energy
      const isEnergy = temp.cards[0] instanceof EnergyCard && temp.cards[0].energyType === EnergyType.BASIC;

      if (isEnergy) {

        // Prompt to attach energy if any were drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
          { min: 1, max: 1 }
        ), transfers => {

          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
            }
          }

          player.supporter.moveCardTo(effect.trainerCard, player.discard);

          return state;
        });
      } else {
        temp.moveToTopOfDestination(player.deck);
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      }

      return state;
    }
    return state;
  }
}
