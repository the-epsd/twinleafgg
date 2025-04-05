"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trubbish = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Trubbish extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Acid Spray',
                cost: [P],
                damage: 10,
                text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
            }];
        this.set = 'BKP';
        this.name = 'Trubbish';
        this.fullName = 'Trubbish BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '56';
    }
    reduceEffect(store, state, effect) {
        // Acid Spray
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check for energy to discard
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, selected);
                        return store.reduceEffect(state, discardEnergy);
                    });
                }
            });
        }
        return state;
    }
}
exports.Trubbish = Trubbish;
