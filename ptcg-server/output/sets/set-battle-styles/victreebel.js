"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Victreebel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Victreebel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.TIME_CIRCLE_MARKER = 'TIME_CIRCLE_MARKER';
        this.CLEAR_TIME_CIRCLE_MARKER = 'CLEAR_TIME_CIRCLE_MARKER';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Weepinbell';
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Panic Vine',
                cost: [card_types_1.CardType.GRASS],
                damage: 40,
                text: 'Your opponent\'s Active Pokémon is now Confused. During' +
                    'your opponent\'s next turn, that Pokémon can\'t retreat.'
            },
            {
                name: 'Solar Beam',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Victreebel';
        this.fullName = 'Victreebel BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.TIME_CIRCLE_MARKER, this);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.CONFUSED);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TIME_CIRCLE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_TIME_CIRCLE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.TIME_CIRCLE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Victreebel = Victreebel;
