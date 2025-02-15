"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MorpekoVUNIONTopLeft = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const morpeko_v_union_tr_1 = require("./morpeko-v-union-tr");
const morpeko_v_union_bl_1 = require("./morpeko-v-union-bl");
const morpeko_v_union_br_1 = require("./morpeko-v-union-br");
class MorpekoVUNIONTopLeft extends pokemon_card_1.PokemonCard {
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
                name: 'Union Gain',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 [L] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'All You Can Eat',
                cost: [C, C],
                damage: 0,
                text: 'Draw cards until you have 10 cards in your hand.'
            },
            {
                name: 'Burst Wheel',
                cost: [L, C, C],
                damage: 100,
                damageCalculation: 'x',
                text: 'Discard all Energy from this Pokémon. This attack does 100 damage for each card you discarded in this way.'
            },
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
        this.setNumber = '215';
        this.name = 'Morpeko V-UNION';
        this.fullName = 'Morpeko V-UNION (Top Left) SWSH';
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
                if (card instanceof MorpekoVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof morpeko_v_union_tr_1.MorpekoVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof morpeko_v_union_bl_1.MorpekoVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof morpeko_v_union_br_1.MorpekoVUNIONBottomRight) {
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
                    player.discard.cards.forEach(card => { if (card instanceof morpeko_v_union_br_1.MorpekoVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof MorpekoVUNIONTopLeft) {
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
        // Union Gain
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let lightningsInDiscard = 0;
            // checking for energies in the discard
            player.discard.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Lightning Energy') {
                    lightningsInDiscard++;
                }
            });
            if (lightningsInDiscard > 0) {
                const blocked = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (card !== this) {
                        blocked.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { allowCancel: false, min: 0, max: Math.min(2, lightningsInDiscard), blockedTo: blocked }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                    }
                });
            }
        }
        // All You Can Eat
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.hand.cards.length >= 10) {
                return state;
            }
            if (player.deck.cards.length === 0) {
                return state;
            }
            while (player.hand.cards.length < 10 && player.deck.cards.length > 0) {
                player.deck.moveTo(player.hand, 1);
            }
        }
        // Burst Wheel
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const energies = player.active.cards.filter(card => card instanceof game_1.EnergyCard);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, energies);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            effect.damage = energies.length * 100;
        }
        return state;
    }
}
exports.MorpekoVUNIONTopLeft = MorpekoVUNIONTopLeft;
