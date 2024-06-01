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
                damage: 60,
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const playerBench = player.bench;
            //console.log(playerBench);
            let evolutionPokemonCount = 0;
            playerBench.forEach(c => {
                var _a, _b, _c, _d, _e;
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    if (((_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) == card_types_1.Stage.STAGE_1 || ((_b = c.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.stage) == card_types_1.Stage.STAGE_2 || ((_c = c.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.stage) == card_types_1.Stage.VMAX || ((_d = c.getPokemonCard()) === null || _d === void 0 ? void 0 : _d.stage) == card_types_1.Stage.VSTAR) {
                        console.log((_e = c.getPokemonCard()) === null || _e === void 0 ? void 0 : _e.stage);
                        evolutionPokemonCount++;
                    }
                }
            });
            console.log('number of evolution pokemon ' + evolutionPokemonCount);
            effect.damage = (evolutionPokemonCount + 1) * 50;
            return state;
        }
        return state;
    }
}
exports.Torterra = Torterra;
