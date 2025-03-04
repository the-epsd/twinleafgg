"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dipplin = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Dipplin extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Applin';
        this.regulationMark = 'I';
        this.cardType = G;
        this.hp = 90;
        this.weakness = [{ type: R }];
        this.retreat = [C, C, C];
        this.attacks = [{
                name: 'Energy Loop',
                cost: [G],
                damage: 50,
                text: 'Put an Energy attached to this Pokémon into your hand.'
            }];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Dipplin';
        this.fullName = 'Dipplin SV9a';
    }
    reduceEffect(store, state, effect) {
        // Energy Loop
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, cards);
            });
        }
        return state;
    }
}
exports.Dipplin = Dipplin;
