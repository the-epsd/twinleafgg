"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articuno = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Articuno extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Ice Symbol',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Your Basic [W] Pokémon\'s attacks, except any Articuno, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Freezing Wind',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Articuno';
        this.fullName = 'Articuno PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const legendaryBird = player.active.getPokemonCard();
            if (legendaryBird && legendaryBird.stage == card_types_1.Stage.BASIC && legendaryBird.cardType == card_types_1.CardType.WATER) {
                if (effect instanceof attack_effects_1.DealDamageEffect) {
                    if (effect.card.name !== 'Articuno') {
                        // exclude Articuno
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
exports.Articuno = Articuno;
