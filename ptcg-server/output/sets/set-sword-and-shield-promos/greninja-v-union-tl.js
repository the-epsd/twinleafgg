"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaVUNIONTopLeft = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const greninja_v_union_tr_1 = require("./greninja-v-union-tr");
const greninja_v_union_bl_1 = require("./greninja-v-union-bl");
const greninja_v_union_br_1 = require("./greninja-v-union-br");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GreninjaVUNIONTopLeft extends pokemon_card_1.PokemonCard {
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
                powerType: game_1.PowerType.VUNION_ASSEMBLY,
            },
            {
                name: 'Ninja Body',
                text: 'Whenever your opponent plays an Item card from their hand, prevent all effects of that card done to this Pokémon.',
                powerType: game_1.PowerType.ABILITY
            },
            {
                name: 'Antidote Jutsu',
                text: 'This Pokémon can\'t be Poisoned.',
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
                name: 'Union Gain',
                cost: [C],
                damage: 0,
                text: 'Attach up to 2 [W] Energy cards from your discard pile to this Pokémon.'
            },
            {
                name: 'Aqua Edge',
                cost: [W],
                damage: 130,
                text: ''
            },
            {
                name: 'Twister Shuriken',
                cost: [W, W, C],
                damage: 0,
                text: 'This attack does 100 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Waterfall Bind',
                cost: [W, W, C],
                damage: 180,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }
        ];
        this.set = 'SWSH';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '155';
        this.name = 'Greninja V-UNION';
        this.fullName = 'Greninja V-UNION (Top Left) SWSH';
        this.WATERFALL_BIND_MARKER = 'WATERFALL_BIND_MARKER';
        this.FEEL_THE_WAY_MARKER = 'FEEL_THE_WAY_MARKER';
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
                if (card instanceof GreninjaVUNIONTopLeft) {
                    topLeftPiece = true;
                }
                if (card instanceof greninja_v_union_tr_1.GreninjaVUNIONTopRight) {
                    topRightPiece = true;
                }
                if (card instanceof greninja_v_union_bl_1.GreninjaVUNIONBottomLeft) {
                    bottomLeftPiece = true;
                }
                if (card instanceof greninja_v_union_br_1.GreninjaVUNIONBottomRight) {
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
                    player.discard.cards.forEach(card => { if (card instanceof greninja_v_union_br_1.GreninjaVUNIONBottomRight) {
                        player.discard.moveCardTo(card, slots[0]);
                    } });
                    // gotta make sure the actual mon ends up on top
                    player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONTopLeft) {
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
        // Ninja Body
        if (effect instanceof play_card_effects_1.PlayItemEffect && effect.target && effect.target.cards.includes(this)) {
            /*const player = StateUtils.findOwner(state, effect.target);
      
            try {
              const stub = new PowerEffect(player, {
                name: 'test',
                powerType: PowerType.ABILITY,
                text: ''
              }, this);
              store.reduceEffect(state, stub);
            } catch {
              return state;
            }*/
            effect.preventDefault = true;
        }
        // Antidote Jutsu
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.target.cards.includes(this) && effect.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
            effect.preventDefault = true;
        }
        // Feel the Way
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[3]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (this.marker.hasMarker(this.FEEL_THE_WAY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (opponent.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_EFFECT, opponent.hand.cards), () => { });
            this.marker.addMarker(this.FEEL_THE_WAY_MARKER, this);
            player.marker.addMarker(this.FEEL_THE_WAY_MARKER, this);
        }
        // Union Gain
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let watersInDiscard = 0;
            // checking for energies in the discard
            player.discard.cards.forEach(card => {
                if (card instanceof game_1.EnergyCard && card.energyType === card_types_1.EnergyType.BASIC && card.name === 'Water Energy') {
                    watersInDiscard++;
                }
            });
            if (watersInDiscard > 0) {
                const blocked = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                    if (card !== this) {
                        blocked.push(target);
                    }
                });
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 0, max: Math.min(2, watersInDiscard), blockedTo: blocked }), transfers => {
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
        // Twister Shuriken
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const damage = new attack_effects_1.PutDamageEffect(effect, 100);
                damage.target = cardList;
                store.reduceEffect(state, damage);
            });
        }
        // Waterfall Bind
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[3]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.WATERFALL_BIND_MARKER, this);
            opponent.marker.addMarker(this.WATERFALL_BIND_MARKER, this);
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.marker.hasMarker(this.WATERFALL_BIND_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.WATERFALL_BIND_MARKER, this)) {
            effect.player.marker.removeMarker(this.WATERFALL_BIND_MARKER, this);
            effect.player.active.marker.removeMarker(this.WATERFALL_BIND_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FEEL_THE_WAY_MARKER, this)) {
            effect.player.marker.removeMarker(this.FEEL_THE_WAY_MARKER, this);
            this.marker.removeMarker(this.FEEL_THE_WAY_MARKER, this);
        }
        return state;
    }
}
exports.GreninjaVUNIONTopLeft = GreninjaVUNIONTopLeft;
