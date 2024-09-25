"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteKyurem = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class WhiteKyurem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Field Crush',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'If your opponent has a Stadium card in play, discard it.'
            }, {
                name: 'Freezing Flames',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: '+',
                text: 'If this Pokémon has any [R] Energy attached to it, this attack does 80 more damage.'
            }];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'White Kyurem';
        this.fullName = 'White Kyurem LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (!stadiumCard) {
                return state;
            }
            const stadiumCardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const owner = game_1.StateUtils.findOwner(state, stadiumCardList);
            if (stadiumCard !== undefined && owner !== effect.player) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
                return state;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergy);
            const hasFireEnergy = checkProvidedEnergy.energyMap.some(e => e.provides.includes(card_types_1.CardType.ANY) || e.provides.includes(card_types_1.CardType.FIRE) || e.provides.includes(card_types_1.CardType.GRW) || e.provides.includes(card_types_1.CardType.GRPD));
            if (hasFireEnergy) {
                effect.damage += 80;
            }
            return state;
        }
        return state;
    }
}
exports.WhiteKyurem = WhiteKyurem;
