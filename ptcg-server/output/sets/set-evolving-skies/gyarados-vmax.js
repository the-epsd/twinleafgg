"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GyaradosVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GyaradosVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Gyarados V';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Hyper Beam',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard an Energy from your opponent\'s Active Pokémon.'
            }, {
                name: 'Max Tyrant',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 240,
                text: ''
            }];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Gyarados VMAX';
        this.fullName = 'Gyarados VMAX EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                opponent.active.moveCardTo(card, opponent.discard);
                return state;
            });
        }
        return state;
    }
}
exports.GyaradosVMAX = GyaradosVMAX;
