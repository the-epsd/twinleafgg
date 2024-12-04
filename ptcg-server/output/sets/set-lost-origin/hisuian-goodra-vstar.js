"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianGoodraVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HisuianGoodraVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Hisuian Goodra V';
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 270;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Moisture Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may heal all damage from this Pokémon. (You can\'t use more than 1 VSTAR Power in a game.) '
            }];
        this.attacks = [
            {
                name: 'Rolling Iron',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'During your opponent\'s next turn, this Pokémon takes 80 less damage from attacks (after applying Weakness and Resistance).'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Hisuian Goodra VSTAR';
        this.fullName = 'Hisuian Goodra VSTAR LOR';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    const healEffect = new game_effects_1.HealEffect(player, cardList, 999);
                    store.reduceEffect(state, healEffect);
                }
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.damage -= 80;
                return state;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.active.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
            console.log('marker removed');
        }
        return state;
    }
}
exports.HisuianGoodraVSTAR = HisuianGoodraVSTAR;
