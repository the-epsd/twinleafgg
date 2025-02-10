"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxtricityex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Toxtricityex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Toxel';
        this.cardType = F;
        this.hp = 260;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Knocking Hammer',
                cost: [L, L],
                damage: 70,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Gaia Punk',
                cost: [L, L, L],
                damage: 270,
                text: 'Discard 3 [L] Energy from your Pokémon.'
            }
        ];
        this.set = 'PAR';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
        this.name = 'Toxtricity ex';
        this.fullName = 'Toxtricity ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Knocking Hammer
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            effect.opponent.deck.moveTo(effect.opponent.discard, 1);
        }
        // Gaia Punk
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3, L);
        }
        return state;
    }
}
exports.Toxtricityex = Toxtricityex;
