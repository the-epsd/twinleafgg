"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thwackey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Thwackey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.evolvesFrom = 'Grookey';
        this.powers = [{
                name: 'Lay of the Land',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If you have a Stadium in play, this Pokemon has no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Branch Poke',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }
        ];
        this.regulationMark = 'D';
        this.set = 'SHF';
        this.name = 'Thwackey';
        this.fullName = 'Thwackey SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Getting stadium in play
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            // If no stadium in play, return state
            if (stadiumCard === undefined) {
                return state;
            }
            // Figuring out owner of Stadium
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const stadiumOwner = game_1.StateUtils.findOwner(state, cardList);
            // If stadium in play, remove retreat cost from Thwackey in play
            if (stadiumCard !== undefined && stadiumOwner === player) {
                effect.cost = [];
            }
        }
        return state;
    }
}
exports.Thwackey = Thwackey;
