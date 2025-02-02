"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eternatus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Eternatus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 150;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Dynablast',
                cost: [D],
                damage: 10,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 80 more damage.'
            },
            {
                name: 'World\'s End',
                cost: [R, D, D],
                damage: 230,
                text: 'Discard a Stadium in play. If you can\'t, this attack does nothing.'
            }
        ];
        this.set = 'SV8';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.name = 'Eternatus';
        this.fullName = 'Eternatus SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive && (opponentActive.tags.includes(card_types_1.CardTag.POKEMON_ex))) {
                effect.damage += 80;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard === undefined) {
                effect.damage = 0;
                return state;
            }
            // Discard Stadium
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const player = game_1.StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            effect.damage = 230; // Set the damage to 230 as specified in the original attack
            return state;
        }
        return state;
    }
}
exports.Eternatus = Eternatus;
