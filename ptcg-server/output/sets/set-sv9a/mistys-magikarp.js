"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MistysMagikarp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MistysMagikarp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.MISTYS];
        this.cardType = W;
        this.hp = 30;
        this.weakness = [{ type: L }];
        this.retreat = [C];
        this.powers = [{
                name: 'Storehouse Hideaway',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks ' +
                    'from your opponent\'s Pokémon done to this Pokémon.'
            }];
        this.attacks = [{ name: 'Splash', cost: [W], damage: 10, text: '' }];
        this.set = 'SV9a';
        this.name = 'Misty\'s Magikarp';
        this.fullName = 'Misty\'s Magikarp SV9a';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect || effect instanceof attack_effects_1.PutCountersEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.MistysMagikarp = MistysMagikarp;
