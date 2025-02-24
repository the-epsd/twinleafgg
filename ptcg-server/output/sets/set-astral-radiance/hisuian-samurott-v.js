"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianSamurottV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class HisuianSamurottV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 220;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Basket Crash',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Discard up to 2 Pokémon Tools from your opponent\'s Pokémon.'
            },
            {
                name: 'Shadow Slash',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 180,
                text: 'Discard an Energy from this Pokémon.'
            }
        ];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '101';
        this.name = 'Hisuian Samurott V';
        this.fullName = 'Hisuian Samurott V ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.CHOOSE_TOOLS_TO_REMOVE_PROMPT(store, state, effect.player, game_1.PlayerType.TOP_PLAYER, game_1.SlotType.DISCARD, 0, 1);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.HisuianSamurottV = HisuianSamurottV;
