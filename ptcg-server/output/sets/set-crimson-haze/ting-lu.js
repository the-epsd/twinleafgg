"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LugiaVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LugiaVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ground Crack',
                cost: [],
                damage: 30,
                text: 'If a Stadium is in play, this attack does 30 damage to each of your opponent\'s Benched Pokémon. Then, discard that Stadium. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Hammer In',
                cost: [],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Ting-Lu';
        this.fullName = 'Ting-Lu SV6';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                // Discard Stadium
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.LugiaVSTAR = LugiaVSTAR;
