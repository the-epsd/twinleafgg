"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorpekoVUNIONBottomRight = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const morpeko_v_union_tl_1 = require("./morpeko-v-union-tl");
const morpeko_v_union_tr_1 = require("./morpeko-v-union-tr");
const morpeko_v_union_bl_1 = require("./morpeko-v-union-bl");
class MorpekoVUNIONBottomRight extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = L;
        this.hp = 310;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Morpeko V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Morpeko V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.VUNION_ASSEMBLY,
            }
        ];
        this.attacks = [
            {
                name: 'Electric Ball',
                cost: [L, C, C],
                damage: 160,
                text: ''
            }
        ];
        this.set = 'SWSH';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '218';
        this.name = 'Morpeko V-UNION';
        this.fullName = 'Morpeko V-UNION (Bottom Right) SWSH';
    }
    reduceEffect(store, state, effect) {
        // assemblin the v-union
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.assembledVUNIONs.includes(this.name)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let topLeftPiece = false;
            let topRightPiece = false;
            let bottomLeftPiece = false;
            let bottomRightPiece = false;
            player.discard.cards.forEach(card => {
                if (card instanceof morpeko_v_union_tl_1.MorpekoVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof morpeko_v_union_tr_1.MorpekoVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof morpeko_v_union_bl_1.MorpekoVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof MorpekoVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof morpeko_v_union_tr_1.MorpekoVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof morpeko_v_union_bl_1.MorpekoVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof morpeko_v_union_tl_1.MorpekoVUNIONTopLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.assembledVUNIONs.push(this.name);
                    slots[0].pokemonPlayedTurn = state.turn;
                }
            }
            else {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
        }
        return state;
    }
}
exports.MorpekoVUNIONBottomRight = MorpekoVUNIONBottomRight;
