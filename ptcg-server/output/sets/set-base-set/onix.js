"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onix = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Onix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Onix';
        this.cardImage = 'assets/cardback.png';
        this.set = 'BS';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.setNumber = '56';
        this.fullName = 'Onix BS';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS, value: 2 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rock Throw',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 10,
                text: ''
            },
            {
                name: 'Harden',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                text: 'During your opponent\'s next turn, whenever 30 or less damage is done to Onix (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.)',
                damage: 0
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.marker.addMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.cards.includes(this) && effect.damage <= 30) {
            const player = effect.player;
            if (player.marker.hasMarker(game_1.PokemonCardList.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.preventDefault = true;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(game_1.PokemonCardList.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Onix = Onix;
