"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terrakion = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Terrakion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
            name: 'Cavern Tackle',
            cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
            damage: 120,
            text: 'During your opponent\'s next turn, prevent all damage from attacks done to this Pokémon. If 1 of your Pokémon used Cavern Tackle during your last turn, this attack can\'t be used. '
        }];
        this.set = 'SIT';
        this.setNumber = '97';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Terrakion';
        this.fullName = 'Terrakion SIT';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.CAVERN_TACKLE_MARKER = 'CAVERN_TACKLE_MARKER';
        this.CLEAR_CAVERN_TACKLE_MARKER = 'CLEAR_CAVERN_TACKLE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check marker
            if (player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            player.active.marker.addMarker(this.CAVERN_TACKLE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_CAVERN_TACKLE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.CAVERN_TACKLE_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_CAVERN_TACKLE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_CAVERN_TACKLE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.CAVERN_TACKLE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Terrakion = Terrakion;
