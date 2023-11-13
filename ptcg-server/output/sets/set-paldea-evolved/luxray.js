"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Swelling Flash',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }];
        this.attacks = [{
                name: 'Tail Snap',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '71';
        this.name = 'Luxray';
        this.fullName = 'Luxray PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === game_1.PowerType.ABILITY
            && effect.power.name !== 'Swelling Flash') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
                this.stage = card_types_1.Stage.BASIC;
            }
            return state;
        }
        return state;
    }
}
exports.Luxray = Luxray;
