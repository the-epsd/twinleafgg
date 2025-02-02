"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Koraidonex = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Koraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.ANCIENT, card_types_2.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 230;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Retribution Strike',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculator: '+',
                text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
            },
            {
                name: 'Kaiser Tackle',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 280,
                text: 'This Pokémon does 60 damage to itself.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '120';
        this.name = 'Koraidon ex';
        this.fullName = 'Koraidon ex TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.damage += effect.player.active.damage;
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 60);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Koraidonex = Koraidonex;
