"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZacianVUNIONTopLeft = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const zacian_v_union_tr_1 = require("./zacian-v-union-tr");
const zacian_v_union_bl_1 = require("./zacian-v-union-bl");
const zacian_v_union_br_1 = require("./zacian-v-union-br");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ZacianVUNIONTopLeft extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VUNION;
        this.tags = [card_types_1.CardTag.POKEMON_VUNION];
        this.cardType = M;
        this.hp = 320;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.powers = [
            {
                name: 'Zacian V-UNION Assembly',
                text: 'Once per game during your turn, combine 4 different Zacian V-UNION from your discard pile and put them onto your bench.',
                useFromDiscard: true,
                exemptFromAbilityLock: true,
                powerType: game_1.PowerType.ABILITY
            }
        ];
        this.attacks = [
            {
                name: 'Union Gain',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 [M] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Dance of the Crowned Sword',
                cost: [M, M, C],
                damage: 150,
                text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 150 less damage (before applying Weakness and Resistance).'
            },
            {
                name: 'Steel Cut',
                cost: [M, M, C],
                damage: 200,
                text: ''
            },
            {
                name: 'Master Blade',
                cost: [M, M, M, C],
                damage: 340,
                text: 'Discard 3 Energy from this Pokémon.'
            }
        ];
        this.set = 'SP';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '163';
        this.name = 'Zacian V-UNION';
        this.fullName = 'Zacian V-UNION (Top Left) SP';
        this.DANCE_REDUCED_DAMAGE_MARKER = 'DANCE_REDUCED_DAMAGE_MARKER';
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
                if (card instanceof ZacianVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof zacian_v_union_tr_1.ZacianVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof zacian_v_union_bl_1.ZacianVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof zacian_v_union_br_1.ZacianVUNIONBottomRight) {
                    bottomRightPiece = true;
                }
            });
            if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
                if (slots.length > 0) {
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_tr_1.ZacianVUNIONTopRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_bl_1.ZacianVUNIONBottomLeft) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    player.discard.cards.forEach(card => { if (card instanceof zacian_v_union_br_1.ZacianVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof ZacianVUNIONTopLeft) {
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
            let metalsInDiscard = 0;
            // checking for energies in the discard
            player.discard.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Metal Energy') {
                    metalsInDiscard++;
                }
            });
            if (metalsInDiscard > 0) {
                const blocked = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (card !== this) {
                        blocked.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { allowCancel: false, min: 0, max: Math.min(2, metalsInDiscard), blockedTo: blocked }), transfers => {
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
        // Dance of the Crowned Sword
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const opponent = effect.opponent;
            opponent.active.marker.addMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect) {
            if (effect.source.marker.hasMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this)) {
                effect.damage -= 150;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this)) {
            effect.player.marker.removeMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this)) {
                    cardList.marker.removeMarker(this.DANCE_REDUCED_DAMAGE_MARKER, this);
                }
            });
        }
        // Master Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[3]) {
            const player = effect.player;
            if (!player.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [C, C, C], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
        }
        return state;
    }
}
exports.ZacianVUNIONTopLeft = ZacianVUNIONTopLeft;
