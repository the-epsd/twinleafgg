"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonosWattrel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class IonosWattrel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.IONOS];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Quick Attack',
                cost: [L],
                damage: 10,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 20 more damage.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Iono\'s Wattrel';
        this.fullName = 'Iono\'s Wattrel SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.IonosWattrel = IonosWattrel;
