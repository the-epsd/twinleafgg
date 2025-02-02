"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoVUNIONBottomRight = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const mewtwo_v_union_tl_1 = require("./mewtwo-v-union-tl");
const mewtwo_v_union_tr_1 = require("./mewtwo-v-union-tr");
const mewtwo_v_union_bl_1 = require("./mewtwo-v-union-bl");
class MewtwoVUNIONBottomRight extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = P;
        this.hp = 310;
        this.weakness = [{ type: D }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Mewtwo V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Mewtwo V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            },
            {
                name: 'Photon Barrier',
                text: 'Prevent all effects of attacks from your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY
            },
        ];
        this.attacks = [
            {
                name: 'Final Burn',
                cost: [P, P, P, C],
                damage: 300,
                text: ''
            }
        ];
        this.set = 'SP';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '162';
        this.name = 'Mewtwo V-UNION';
        this.fullName = 'Mewtwo V-UNION (Bottom Right) SP';
    }
    reduceEffect(store, state, effect) {
        // assemblin the v-union
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.assembledMewtwo) {
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
                if (card instanceof mewtwo_v_union_tl_1.MewtwoVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof mewtwo_v_union_tr_1.MewtwoVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof mewtwo_v_union_bl_1.MewtwoVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof MewtwoVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_tr_1.MewtwoVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_bl_1.MewtwoVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof MewtwoVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof mewtwo_v_union_tl_1.MewtwoVUNIONTopLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.assembledMewtwo = true;
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
exports.MewtwoVUNIONBottomRight = MewtwoVUNIONBottomRight;
