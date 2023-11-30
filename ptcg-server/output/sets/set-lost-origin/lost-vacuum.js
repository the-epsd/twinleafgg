"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostVacuum = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
class LostVacuum extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.regulationMark = 'F';
        this.set = 'LOR';
        this.set2 = 'astralradiance';
        this.setNumber = '141';
        this.name = 'Lost Vacuum';
        this.fullName = 'Lost Vacuum LOR';
        this.text = '';
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
}
exports.LostVacuum = LostVacuum;
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
