"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ursaluna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Ursaluna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        //this.evolvesFrom = 'Ursaring';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Peat Hunt',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put up to 2 cards from your discard pile into your hand.'
            },
            {
                name: 'Bulky Bump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Discard 2 Energy from this Pokemon.'
            }
        ];
        this.set = 'SSH';
        this.name = 'Ursaluna';
        this.fullName = 'Ursaluna ASR 124';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const discardCount = player.discard.cards.length;
            if (discardCount === 0) {
                return state;
            }
            const max = Math.min(2, discardCount);
            const min = Math.min(1, max);
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 2, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
  exports.Ursaluna = Ursaluna