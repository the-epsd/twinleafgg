"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meditite = void 0;
/* eslint-disable indent */
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Meditite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.attacks = [
            {
                name: 'Calm Mind',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Chop',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '77';
        this.name = 'Meditite';
        this.fullName = 'Meditite SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healEffect = new game_effects_1.HealEffect(player, effect.player.active, 20);
            state = store.reduceEffect(state, healEffect);
        }
        return state;
    }
}
exports.Meditite = Meditite;
