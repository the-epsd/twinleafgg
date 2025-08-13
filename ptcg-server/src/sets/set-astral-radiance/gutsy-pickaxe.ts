import { AttachEnergyPrompt, CardList, EnergyCard, EnergyType, GameMessage, PlayerType, ShowCardsPrompt, SlotType, State, StateUtils, StoreLike, SuperType, TrainerCard, TrainerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER } from '../../game/store/prefabs/prefabs';

export class GutsyPickaxe extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '145';

  public name: string = 'Gutsy Pickaxe';

  public fullName: string = 'Gutsy Pickaxe ASR';

  public text: string =
    'Reveal the top card of your deck. If that card is a [F] Energy card, attach it to 1 of your Benched Pokémon. If it is not a [F] Energy card, put it into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      // // We will discard this card after prompt confirmation
      // effect.preventDefault = true;

      player.deck.moveTo(temp, 1);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Fighting Energy';
      });


      // If no energy cards were drawn, move all cards to hand
      if (temp.cards.length > 0) {
        return store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          temp.cards
        ), () => {
          if (energyCardsDrawn.length == 0) {
            return store.prompt(state, new ShowCardsPrompt(
              player.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              temp.cards
            ), () => {
              temp.cards.slice(0, 1).forEach(card => {
                temp.moveCardTo(card, player.hand);
                CLEAN_UP_SUPPORTER(effect, player);
              });
            });
          } else {


            // Prompt to attach energy if any were drawn
            return store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_CARDS,
              temp, // Only show drawn energies
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
              { min: 0, allowCancel: false, max: energyCardsDrawn.length }
            ), transfers => {

              // Attach energy based on prompt selection
              if (transfers) {
                for (const transfer of transfers) {
                  const target = StateUtils.getTarget(state, player, transfer.to);
                  temp.moveCardTo(transfer.card, target); // Move card to target
                  CLEAN_UP_SUPPORTER(effect, player);
                }
                temp.cards.forEach(card => {
                  temp.moveCardTo(card, player.hand); // Move card to hand
                  CLEAN_UP_SUPPORTER(effect, player);
                });
                return state;
              }
              return state;
            });
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}