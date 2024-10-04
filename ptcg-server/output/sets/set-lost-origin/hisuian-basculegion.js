"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianBasculegion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class HisuianBasculegion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 110;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.evolvesFrom = 'Hisuian Basculin';
        this.attacks = [{
                name: 'Upstream Spirits',
                cost: [],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each basic Energy card in your discard pile. Then, shuffle those cards into your deck.'
            },
            {
                name: 'Water Shot',
                cost: [card_types_1.CardType.WATER],
                damage: 70,
                text: ' Discard an Energy from this Pokémon.'
            }];
        this.set = 'LOR';
        this.setNumber = '45';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hisuian Basculegion';
        this.fullName = 'Hisuian Basculegion LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energyInDiscard = 0;
            const blocked = [];
            const basicEnergyCards = [];
            player.discard.cards.forEach((c, index) => {
                const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC;
                if (isBasicEnergy) {
                    energyInDiscard += 1;
                    basicEnergyCards.push(c);
                }
                else {
                    blocked.push(index);
                }
            });
            effect.damage = energyInDiscard * 20;
            player.discard.cards.forEach(cards => {
                if (cards instanceof game_1.EnergyCard && cards.energyType === card_types_1.EnergyType.BASIC) {
                    player.discard.moveCardsTo(basicEnergyCards, player.deck);
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
        }
        return state;
    }
}
exports.HisuianBasculegion = HisuianBasculegion;
