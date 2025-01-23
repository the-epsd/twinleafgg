"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ralts = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// BUS Ralts 91 (https://limitlesstcg.com/cards/BUS/91)
class Ralts extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Draining Kiss', cost: [card_types_1.CardType.FAIRY], damage: 10, text: 'Heal 10 damage from this Pokemon.' }
        ];
        this.set = 'BUS';
        this.setNumber = '91';
        this.name = 'Ralts';
        this.fullName = 'Ralts BUS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 10);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        return state;
    }
}
exports.Ralts = Ralts;
