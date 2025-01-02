"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafeonVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class LeafeonVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Leafeon V';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 260;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Ivy Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [{
                name: 'Leaf Guard',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.regulationMark = 'F';
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '195';
        this.name = 'Leafeon VSTAR';
        this.fullName = 'Leafeon VSTAR SWSH';
        this.LEAF_GUARD_MARKER = 'LEAF_GUARD_MARKER';
        this.CLEAR_LEAF_GUARD_MARKER = 'CLEAR_LEAF_GUARD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                player.usedVSTAR = true;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.LEAF_GUARD_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_LEAF_GUARD_MARKER, this);
            if (effect instanceof attack_effects_1.PutDamageEffect
                && effect.target.marker.hasMarker(this.LEAF_GUARD_MARKER)) {
                effect.damage -= 30;
                return state;
            }
            if (effect instanceof game_phase_effects_1.EndTurnEffect
                && effect.player.marker.hasMarker(this.CLEAR_LEAF_GUARD_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_LEAF_GUARD_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.LEAF_GUARD_MARKER, this);
                });
            }
            return state;
        }
        return state;
    }
}
exports.LeafeonVSTAR = LeafeonVSTAR;
