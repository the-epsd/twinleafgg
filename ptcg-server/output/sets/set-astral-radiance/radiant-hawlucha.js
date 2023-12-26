"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantHawlucha = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RadiantHawlucha extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RADIANT];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Big Match',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon VMAX (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Spiral Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.name = 'Radiant Hawlucha';
        this.fullName = 'Radiant Hawlucha ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            if (player.active.getPokemonCard() === this) {
                return state;
            }
            if (effect.target !== player.active && effect.target !== opponent.active) {
                return state;
            }
            const targetCard = effect.target.getPokemonCard();
            if (targetCard && targetCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 30;
            }
        }
        return state;
    }
}
exports.RadiantHawlucha = RadiantHawlucha;
