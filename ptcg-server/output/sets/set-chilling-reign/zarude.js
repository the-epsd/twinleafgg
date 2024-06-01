"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zarude = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Zarude extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Pack Call',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for a [G] Pokemon, reveal it, and put it into your hand. If you go second'
                    + ' and it\'s your first turn, search for up to 3 [G] Pokemon instead of 1. Then, shuffle your deck.'
            },
            {
                name: 'Repeated Whip',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack does 20 more damage for each [G] Energy attached to this Pokemon.'
            }];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Zarude';
        this.fullName = 'Zarude CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const turn = state.turn;
            if (turn == 2) {
                const player = effect.player;
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 3, allowCancel: true }), cards => {
                    player.deck.moveCardsTo(cards, player.hand);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
            if (turn > 2) {
                const player = effect.player;
                return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: true }), cards => {
                    player.deck.moveCardsTo(cards, player.hand);
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.GRASS;
                }).length;
            });
            effect.damage += energyCount * 20;
        }
        return state;
    }
}
exports.Zarude = Zarude;
