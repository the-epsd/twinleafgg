"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnergyPouch = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
class EnergyPouch extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'FCO';
        this.name = 'Energy Pouch';
        this.fullName = 'Energy Pouch FCO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '97';
        this.text = 'If the Pokémon this card is attached to is Knocked Out by damage from an opponent\'s attack, put all basic Energy attached to that Pokémon into your hand.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
            const player = effect.player;
            const target = effect.target;
            const removedCards = [];
            const pokemonIndices = effect.target.cards.map((card, index) => index);
            for (let i = pokemonIndices.length - 1; i >= 0; i--) {
                const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
                removedCards.push(removedCard);
                target.damage = 0;
            }
            const basicEnergy = new game_1.CardList();
            basicEnergy.cards = removedCards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC);
            basicEnergy.cards.forEach(c => {
                store.log(state, game_1.GameLog.LOG_PLAYER_RETURNS_CARD_TO_HAND, {
                    name: player.name,
                    card: c.name
                });
            });
            basicEnergy.moveTo(player.hand);
            return state;
        }
        return state;
    }
}
exports.EnergyPouch = EnergyPouch;
