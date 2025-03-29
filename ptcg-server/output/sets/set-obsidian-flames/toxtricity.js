"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxtricity = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Toxtricity extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toxel';
        this.cardType = L;
        this.hp = 140;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Leer',
                cost: [L],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            },
            {
                name: 'Loud Mix',
                cost: [L, C],
                damage: 50,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each different type of Pokémon on your Bench.'
            }];
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Toxtricity';
        this.fullName = 'Toxtricity OBF';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, (result => {
                if (result) {
                    attack_effects_1.YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
                }
            }));
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const playerBench = player.bench;
            const uniqueTypes = new Set();
            playerBench.forEach(c => {
                if (c.getPokemonCard() instanceof pokemon_card_1.PokemonCard) {
                    const card = c.getPokemonCard();
                    const cardType = card === null || card === void 0 ? void 0 : card.cardType;
                    if (cardType) {
                        uniqueTypes.add(cardType);
                    }
                    if (card === null || card === void 0 ? void 0 : card.additionalCardTypes) {
                        card.additionalCardTypes.forEach(type => uniqueTypes.add(type));
                    }
                }
            });
            // Set the damage based on the count of unique Pokémon types
            effect.damage += 30 * uniqueTypes.size;
            return state;
        }
        return state;
    }
}
exports.Toxtricity = Toxtricity;
