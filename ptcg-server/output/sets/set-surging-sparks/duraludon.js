"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duraludon = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Duraludon extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.METAL;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.resistance = [{ type: game_1.CardType.GRASS, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Confront',
                cost: [game_1.CardType.METAL, game_1.CardType.METAL],
                damage: 50,
                text: ''
            },
            {
                name: 'Durant Beam',
                cost: [game_1.CardType.METAL, game_1.CardType.METAL, game_1.CardType.METAL],
                damage: 130,
                text: 'Discard 2 Energy from this Pokemon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '129';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Duraludon';
        this.fullName = 'Duraludon SV7a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.Duraludon = Duraludon;
