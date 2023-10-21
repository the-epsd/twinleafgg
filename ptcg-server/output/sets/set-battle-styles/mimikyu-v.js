"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimikyuV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class MimikyuV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 160;
        this.weakness = [{
                type: card_types_1.CardType.DARK
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dummmy Doll',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your ' +
                    'Bench during your turn, you may prevent all damage ' +
                    'done to this Mimikyu V by attacks from your opponent\'s ' +
                    'Pokémon until the end of your opponent’s next turn.'
            }];
        this.attacks = [
            {
                name: 'X-Scissor',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Put 3 damage counters on your opponent’s Active Pokémon ' +
                    'for each Prize card your opponent has taken. '
            }
        ];
        this.set = 'BST';
        this.set2 = 'battlestyles';
        this.setNumber = '62';
        this.regulationMark = 'E';
        this.name = 'Mimikyu V';
        this.fullName = 'Mimikyu V BST 062';
        this.TIME_CIRCLE_MARKER = 'TIME_CIRCLE_MARKER';
        this.CLEAR_TIME_CIRCLE_MARKER = 'CLEAR_TIME_CIRCLE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
            const sourcePokemon = effect.source.getPokemonCard();
            if (sourcePokemon !== this) {
                effect.preventDefault = true;
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player === game_1.StateUtils.getOpponent(state, effect.player)) {
            const player = game_1.StateUtils.getOpponent(state, effect.player);
            player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.TIME_CIRCLE_MARKER)) {
                    cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
                }
            });
            return state;
        }
        return state;
    }
}
exports.MimikyuV = MimikyuV;
