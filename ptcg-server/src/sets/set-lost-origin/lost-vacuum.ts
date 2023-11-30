import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
export class LostVacuum extends TrainerCard {
  
  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'F';

  public set: string = 'LOR';

  public set2: string = 'astralradiance';

  public setNumber: string = '141';

  public name: string = 'Lost Vacuum';

  public fullName: string = 'Lost Vacuum LOR';
  
  public text = 
    '';

  // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

  // if (effect instanceof TrainerEffect && effect.trainerCard === this) {
  //   const player = effect.player;

  //   return store.prompt(state, new SelectPrompt(
  //     player.id,
  //     GameMessage.CHOOSE_CARD_TYPE_TO_DISCARD,
  //     [GameMessage.ALL_STADIUM_CARDS, GameMessage.ALL_TOOL_CARDS],
  //     { allowCancel: false }
  //   ), choice => {
  //     let cardType: CardType;
  //     if (choice === 0) {
  //       cardType = CardType.STADIUM;
  //     } else {
  //       cardType = CardType.TOOL;
  //     }

  //     const cardsToDiscard = player.car.findAllCards({ cardType });

  //     if (cardsToDiscard.length > 0) {
  //       player.inplay.moveCardsTo(cardsToDiscard, player.lostzone);
  //     }

  //     return state;
  //   });
  // }

  // return state;
}


//   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

//     if (effect instanceof TrainerEffect && effect.trainerCard === this) {
//       const player = effect.player;

//       const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
//       state = store.reduceEffect(state, checkProvidedEnergy);

//       return store.prompt(state, new SelectPrompt(
//         player.id,
//         GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
//         [ GameMessage.ALL_FIRE_ENERGIES, GameMessage.ALL_LIGHTNING_ENERGIES ],
//         { allowCancel: false }
//       ), choice => {
//         const trainerType = choice === 0 ? TrainerType.STADIUM : TrainerType.TOOL;
