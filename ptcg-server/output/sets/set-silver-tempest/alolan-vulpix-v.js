"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanVulpixV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class AlolanVulpixV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'White Drop',
                cost: [],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon V, this attack does 50 more damage.'
            },
            {
                name: 'Frost Smash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'SIT';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Alolan Vulpix V';
        this.fullName = 'Alolan Vulpix V SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const defending = opponent.active.getPokemonCard();
            if (!defending || defending.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 50;
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.AlolanVulpixV = AlolanVulpixV;
