"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Rotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 80;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Crushing Pulse',
                cost: [L],
                damage: 0,
                text: 'Your opponent reveals their hand. Discard all Item cards and Pokémon Tool cards you find there.'
            },
            {
                name: 'Energy Short',
                cost: [L],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Energy attached to your opponent\'s Active Pokémon.'
            },
        ];
        this.set = 'SSP';
        this.regulationMark = 'H';
        this.setNumber = '61';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Rotom';
        this.fullName = 'Rotom SSP';
    }
    reduceEffect(store, state, effect) {
        // Crushing Pulse
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const escrow = new game_1.CardList;
            store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                opponent.hand.cards.forEach(card => {
                    if (card instanceof game_1.TrainerCard && (card.trainerType === card_types_1.TrainerType.ITEM || card.trainerType === card_types_1.TrainerType.TOOL)) {
                        opponent.hand.moveCardTo(card, escrow);
                    }
                });
                escrow.moveTo(opponent.discard);
            });
        }
        // Energy Short
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const opponent = effect.opponent;
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = opponentEnergyCount * 20;
        }
        return state;
    }
}
exports.Rotom = Rotom;
