"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cramorant = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Cramorant extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lost Provisions',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have 4 or more cards in the Lost Zone, ignore all Energy in this Pokémon\'s attack costs.'
            }];
        this.attacks = [
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: 'This attack\'s damage isn\'t affected by Weakness.'
            }
        ];
        this.set = 'LOR';
        this.set2 = 'lostorigin';
        this.setNumber = '50';
        this.name = 'Cramorant';
        this.fullName = 'Cramorant LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.lostzone.cards.length >= 4) {
                const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
                state = store.reduceEffect(state, checkCost);
                this.attacks[0].cost = [];
            }
        }
        return state;
    }
}
exports.Cramorant = Cramorant;
