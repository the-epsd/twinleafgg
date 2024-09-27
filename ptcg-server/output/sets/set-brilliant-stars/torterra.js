"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torterra = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Torterra extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grotle';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Evopress',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 for each of your Evolution Pokemon in play.'
            },
            {
                name: 'Hammer In',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            }];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '8';
        this.name = 'Torterra';
        this.fullName = 'Torterra BRS';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const playerBench = player.bench;
            let evolutionPokemonCount = 0;
            playerBench.forEach(c => {
                var _a;
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    if (((_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) !== card_types_1.Stage.BASIC) {
                        evolutionPokemonCount++;
                    }
                }
            });
            // Don't forget to include the active Pokémon if it's not basic
            if (((_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) !== card_types_1.Stage.BASIC) {
                evolutionPokemonCount++;
            }
            // Set the damage based on the count of evolution Pokémon
            effect.damage = 50 * evolutionPokemonCount;
            return state;
        }
        return state;
    }
}
exports.Torterra = Torterra;
