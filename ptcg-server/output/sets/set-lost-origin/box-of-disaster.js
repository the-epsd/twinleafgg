"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoxOfDisaster = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class BoxOfDisaster extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '154';
        this.name = 'Box of Disaster';
        this.fullName = 'Box of Disaster LOR';
        this.damageDealt = false;
        this.text = 'If the Pokémon V this card is attached to has full HP and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 8 damage counters on the Attacking Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = state_utils_1.StateUtils.findOwner(state, effect.target);
            const pokemonCard = effect.target.getPokemonCard();
            const sourceCard = effect.source.getPokemonCard();
            if (pokemonCard === undefined || sourceCard === undefined || state.phase !== state_1.GamePhase.ATTACK) {
                return state;
            }
            this.damageDealt = true;
            if (this.damageDealt === true) {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, effect.target);
                store.reduceEffect(state, checkHpEffect);
                if (state.phase === state_1.GamePhase.ATTACK) {
                    if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_V)) {
                        if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
                            effect.source.damage += 80;
                        }
                    }
                    if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                        if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
                            effect.source.damage += 80;
                        }
                    }
                    if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VSTAR)) {
                        if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
                            effect.source.damage += 80;
                        }
                    }
                }
            }
        }
        return state;
    }
}
exports.BoxOfDisaster = BoxOfDisaster;
