"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feraligatr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Feraligatr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Croconaw';
        this.powers = [{
                name: 'Downpour',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), you may discard a [W] Energy card from your hand. '
            }];
        this.attacks = [{
                name: 'Riptide',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 10,
                text: 'This attack does 20 more damage for each [W] Energy card in your discard pile. Then, shuffle those cards into your deck.'
            }];
        this.set = 'DRM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Feraligatr';
        this.fullName = 'Feraligatr DRM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.name === 'Water Energy';
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energyInDiscard = 0;
            const blocked = [];
            const basicEnergyCards = [];
            player.discard.cards.forEach((c, index) => {
                const isBasicWaterEnergy = c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.name === 'Water Energy';
                if (isBasicWaterEnergy) {
                    energyInDiscard += 1;
                    basicEnergyCards.push(c);
                }
                else {
                    blocked.push(index);
                }
            });
            effect.damage += energyInDiscard * 20;
            player.discard.cards.forEach(cards => {
                if (cards instanceof game_1.EnergyCard && cards.energyType === card_types_1.EnergyType.BASIC && cards.name === 'Water Energy') {
                    player.discard.moveCardsTo(basicEnergyCards, player.deck);
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Feraligatr = Feraligatr;
