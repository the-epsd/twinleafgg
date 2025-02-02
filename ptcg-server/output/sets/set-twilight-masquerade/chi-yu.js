"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChiYu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ChiYu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Allure',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            },
            {
                name: 'Ground Melter',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 60,
                damageCalculation: '+',
                text: 'If a Stadium is in play, this attack does 60 more damage. Then, discard that Stadium.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Chi-Yu';
        this.fullName = 'Chi-Yu TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.deck.moveTo(player.hand, 2);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                effect.damage += 60;
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
                return state;
            }
        }
        return state;
    }
}
exports.ChiYu = ChiYu;
