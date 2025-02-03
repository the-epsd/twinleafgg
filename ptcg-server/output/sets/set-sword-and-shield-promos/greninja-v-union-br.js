"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaVUNIONBottomRight = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const greninja_v_union_tl_1 = require("./greninja-v-union-tl");
const greninja_v_union_tr_1 = require("./greninja-v-union-tr");
const greninja_v_union_bl_1 = require("./greninja-v-union-bl");
class GreninjaVUNIONBottomRight extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = W;
        this.hp = 300;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Greninja V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Greninja V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            },
            {
                name: 'Feel the Way',
                text: 'Once during your turn, you may have your opponent reveal their hand.',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.attacks = [
            {
                name: 'Waterfall Bind',
                cost: [W, W, C],
                damage: 180,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }
        ];
        this.set = 'SP';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '158';
        this.name = 'Greninja V-UNION';
        this.fullName = 'Greninja V-UNION (Bottom Right) SP';
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
                if (card instanceof greninja_v_union_tl_1.GreninjaVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof greninja_v_union_tr_1.GreninjaVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof greninja_v_union_bl_1.GreninjaVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof GreninjaVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof greninja_v_union_tr_1.GreninjaVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof greninja_v_union_bl_1.GreninjaVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof greninja_v_union_tl_1.GreninjaVUNIONTopLeft) {
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
exports.GreninjaVUNIONBottomRight = GreninjaVUNIONBottomRight;
