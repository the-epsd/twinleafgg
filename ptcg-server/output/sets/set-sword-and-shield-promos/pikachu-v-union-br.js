"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PikachuVUNIONBottomRight = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pikachu_v_union_tl_1 = require("./pikachu-v-union-tl");
const pikachu_v_union_tr_1 = require("./pikachu-v-union-tr");
const pikachu_v_union_bl_1 = require("./pikachu-v-union-bl");
class PikachuVUNIONBottomRight extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = L;
        this.hp = 300;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Pikachu V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Pikachu V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.attacks = [
            {
                name: 'Electro Ball Together',
                cost: [L, L, C],
                damage: 250,
                text: ''
            }
        ];
        this.set = 'SP';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.name = 'Pikachu V-UNION';
        this.fullName = 'Pikachu V-UNION (Bottom Right) SP';
    }
    reduceEffect(store, state, effect) {
        // assemblin the v-union
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.assembledPikachu) {
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
                if (card instanceof pikachu_v_union_tl_1.PikachuVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof pikachu_v_union_tr_1.PikachuVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof pikachu_v_union_bl_1.PikachuVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof PikachuVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof pikachu_v_union_tr_1.PikachuVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof pikachu_v_union_bl_1.PikachuVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof PikachuVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof pikachu_v_union_tl_1.PikachuVUNIONTopLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.assembledPikachu = true;
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
exports.PikachuVUNIONBottomRight = PikachuVUNIONBottomRight;
