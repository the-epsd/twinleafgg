"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Noivernex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Noivernex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Noibat';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 260;
        this.attacks = [
            {
                name: 'Covert Flight',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
            },
            {
                name: 'Dominating Echo',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.DARK],
                damage: 140,
                text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
            },
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '153';
        this.name = 'Noivern ex';
        this.fullName = 'Noivern ex PAL';
        this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
        this.DOMINATING_ECHO_MARKER = 'DOMINATING_ECHO_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER)) {
            const card = effect.source.getPokemonCard();
            const stage = card !== undefined ? card.stage : undefined;
            if (stage === card_types_1.Stage.BASIC) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.DOMINATING_ECHO_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayStadiumEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && card_types_1.EnergyType.SPECIAL) {
            const player = effect.player;
            if (player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this)) {
                effect.player.marker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER, this);
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.marker.hasMarker(this.DOMINATING_ECHO_MARKER, this)) {
                effect.player.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
                const opponent = game_1.StateUtils.getOpponent(state, effect.player);
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                    cardList.marker.removeMarker(this.DOMINATING_ECHO_MARKER, this);
                });
            }
        }
        return state;
    }
}
exports.Noivernex = Noivernex;
