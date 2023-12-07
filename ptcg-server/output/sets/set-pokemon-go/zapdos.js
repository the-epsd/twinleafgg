"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Lightning Symbol',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Your Basic [L] Pokémon\'s attacks, except any Zapdos, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Electric Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.set2 = 'pokemongo';
        this.setNumber = '29';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos PGO';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) == card_types_1.Stage.BASIC && ((_b = player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.cardType) == card_types_1.CardType.LIGHTNING) {
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    if (effect.card.name !== 'Zapdos') {
                        // exclude Zapdos
                        effect.damage += 10;
                    }
                    return state;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
