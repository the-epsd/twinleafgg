"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragapult = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dragapult extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Drakloak';
        this.cardType = P;
        this.hp = 150;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Fusion Strike Assault',
                cost: [P],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each of your Fusion Strike Pokémon in play.'
            },
            {
                name: 'Speed Attack',
                cost: [P, C],
                damage: 120,
                text: ''
            }];
        this.set = 'FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Dragapult';
        this.fullName = 'Dragapult FST';
    }
    reduceEffect(store, state, effect) {
        var _a, _b;
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const playerBench = player.bench;
            let fusionStrikeCount = 0;
            playerBench.forEach(c => {
                var _a, _b;
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    if ((_b = (_a = c.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                        fusionStrikeCount++;
                    }
                }
            });
            // Include the active Pokémon if it's fusion strike
            if ((_b = (_a = player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags) === null || _b === void 0 ? void 0 : _b.includes(card_types_1.CardTag.FUSION_STRIKE)) {
                fusionStrikeCount++;
            }
            // Set the damage based on the count of fusion strike Pokémon
            effect.damage = 30 * fusionStrikeCount;
            return state;
        }
        return state;
    }
}
exports.Dragapult = Dragapult;
