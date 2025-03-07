"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sceptile = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Sceptile extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Grovyle';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Power of Nature',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Prevent all damage done to your Pokémon that have any [G] Energy attached to them by attacks from your opponent\'s Ultra Beasts.'
            }];
        this.attacks = [{
                name: 'Powerful Storm',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage times the amount of Energy attached to all of your Pokémon.'
            }];
        this.set = 'CES';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Sceptile';
        this.fullName = 'Sceptile CES';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.source.getPokemonCard() != null) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, this)) {
                return state;
            }
            prefabs_1.PREVENT_DAMAGE_IF_SOURCE_HAS_TAG(effect, card_types_1.CardTag.ULTRA_BEAST, effect.source.getPokemonCard());
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const attachedEnergy = prefabs_1.GET_TOTAL_ENERGY_ATTACHED_TO_PLAYERS_POKEMON(effect.player, store, state);
            effect.damage = 20 * attachedEnergy;
        }
        return state;
    }
}
exports.Sceptile = Sceptile;
