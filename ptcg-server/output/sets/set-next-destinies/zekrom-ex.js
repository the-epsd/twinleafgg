"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZekromEx = void 0;
const check_effects_1 = require("../../game/store/effects/check-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ZekromEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Glinting Claw',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'Flip a coin. If heads, this attack does 30 more damage.'
            }, {
                name: 'Strong Volt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Discard 2 Energy attached to this Pokemon.'
            },
        ];
        this.set = 'NXD';
        this.name = 'Zekrom EX';
        this.fullName = 'Zekrom EX NXD';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '51';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 30;
                }
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
exports.ZekromEx = ZekromEx;
