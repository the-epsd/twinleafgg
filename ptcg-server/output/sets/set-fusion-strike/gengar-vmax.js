"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GengarVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class GengarVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.evolvesFrom = 'Gengar V';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 320;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fear and Panic',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 60,
                text: 'This attack does 60 damage for each of your opponent\'s Pokémon V and Pokémon-GX in play.'
            },
            {
                name: 'G-Max Swallow Up',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'FST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '157';
        this.name = 'Gengar VMAX';
        this.fullName = 'Gengar VMAX FST';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
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
            const vPokemons = opponent.bench.filter(card => card instanceof pokemon_card_1.PokemonCard && card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_GX));
            const vPokemons2 = opponent.active.getPokemons().filter(card => card.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX || card_types_1.CardTag.POKEMON_GX));
            const vPokes = vPokemons.length + vPokemons2.length;
            const damage = 60 * vPokes;
            effect.damage = damage;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.GengarVMAX = GengarVMAX;
