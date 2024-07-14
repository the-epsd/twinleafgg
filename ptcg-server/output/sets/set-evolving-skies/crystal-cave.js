"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalCave = void 0;
const __1 = require("../..");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CrystalCave extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
        this.trainerType = card_types_1.TrainerType.STADIUM;
        this.set = 'EVS';
        this.name = 'Crystal Cave';
        this.fullName = 'Crystal Cave EVS';
        this.text = 'Once during each player\'s turn, that player may heal 30 damage from each of their [M] Pokémon and [N] Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && __1.StateUtils.getStadiumCard(state) === this) {
            const player = effect.player;
            const targets = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if ([card_types_1.CardType.METAL, card_types_1.CardType.DRAGON].includes(card.cardType) && cardList.damage > 0) {
                    targets.push(cardList);
                }
            });
            if (targets.length === 0) {
                throw new __1.GameError(__1.GameMessage.CANNOT_USE_STADIUM);
            }
            targets.forEach(target => {
                // Heal Pokemon
                const healEffect = new game_effects_1.HealEffect(player, target, 30);
                store.reduceEffect(state, healEffect);
            });
        }
        return state;
    }
}
exports.CrystalCave = CrystalCave;
