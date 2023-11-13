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
