"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feraligatr = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Feraligatr extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Croconaw';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Torrential Heart',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put 5 damage counters on this Pokémon. If you do, attacks used by this Pokémon do 120 more damage to your opponent\'s Active Pokémon during this turn (before applying Weakness and Resistance).'
            }];
        this.attacks = [{
                name: 'Giant Wave',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 160,
                text: 'This Pokémon can\'t use Giant Wave during your next turn.'
            }];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '41';
        this.name = 'Feraligatr';
        this.fullName = 'Feraligatr TEF';
        this.TORRENTIAL_HEART_MARKER = 'TORRENTIAL_HEART_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REPLACE_MARKER_AT_END_OF_TURN(effect, this.ATTACK_USED_MARKER, this.ATTACK_USED_2_MARKER, this);
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.TORRENTIAL_HEART_MARKER, this);
        if (effect instanceof game_effects_1.AttackEffect && effect.player.marker.hasMarker(this.TORRENTIAL_HEART_MARKER, this))
            effect.damage += 120;
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.ATTACK_USED_2_MARKER, effect.player, this);
            prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.TORRENTIAL_HEART_MARKER, effect.player, this);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList instanceof game_1.PokemonCardList) {
                cardList.damage += 50;
                prefabs_1.ADD_MARKER(this.ATTACK_USED_MARKER, effect.player, this);
                prefabs_1.ABILITY_USED(effect.player, this);
            }
        }
        return state;
    }
}
exports.Feraligatr = Feraligatr;
