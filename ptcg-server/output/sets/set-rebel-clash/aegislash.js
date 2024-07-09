"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aegislash = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Aegislash extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'D';
        this.stage = card_types_1.Stage.STAGE_2;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.evolvesFrom = 'Doublade';
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Big Shield',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'All of your Pokémon take 30 less damage from your opponent\'s attacks (after applying Weakness and Resistance). You can\'t apply more than 1 Big Shield Ability at a time.'
            }];
        this.attacks = [{
                name: 'Power Edge',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Aegislash';
        this.fullName = 'Aegislash RCL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                return state;
            }
            const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(effect.target);
            store.reduceEffect(state, checkPokemonType);
            if (checkPokemonType.cardTypes.includes(card_types_1.CardType.METAL)) {
                effect.damage = Math.max(0, effect.damage - 30);
                effect.damageReduced = true;
            }
        }
        return state;
    }
}
exports.Aegislash = Aegislash;
