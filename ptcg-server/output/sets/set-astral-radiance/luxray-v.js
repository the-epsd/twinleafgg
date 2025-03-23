"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuxrayV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class LuxrayV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = L;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 210;
        this.weakness = [{ type: F }];
        this.resistance = [];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Fang Snipe',
                cost: [C, C],
                damage: 30,
                text: 'Your opponent reveals their hand. Discard a Trainer card you find there.'
            },
            {
                name: 'Radiating Pulse',
                cost: [L, L, C],
                damage: 120,
                text: 'Discard 2 Energy from this Pokémon. Your opponent\'s Active Pokémon is now Paralyzed.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Luxray V';
        this.fullName = 'Luxray V ASR';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let cards = [];
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                // Operation canceled by the user
                if (cards.length === 0) {
                    return state;
                }
                prefabs_1.MOVE_CARDS(store, state, opponent.hand, opponent.discard, { cards });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            state = store.reduceEffect(state, checkProvidedEnergy);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY }, { min: 2, max: 2, allowCancel: false }), selected => {
                selected = selected || [];
                player.active.moveCardsTo(selected, player.discard);
            });
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.LuxrayV = LuxrayV;
