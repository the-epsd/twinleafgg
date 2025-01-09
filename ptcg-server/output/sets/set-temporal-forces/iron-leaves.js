"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronLeavesex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronLeavesex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
            name: 'Rapid Vernier',
            powerType: game_1.PowerType.ABILITY,
            text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may switch this Pokémon with your Active Pokémon. If you do, you may move any number of Energy from your Benched Pokémon to this Pokémon.'
        }];
        this.attacks = [
            {
                name: 'Prismatic Edge',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'SV5';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '016';
        this.name = 'Iron Leaves ex';
        this.fullName = 'Iron Leaves ex';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard == this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const player = effect.player;
                    const target = effect.target;
                    player.switchPokemon(target);
                    const blockedMap = [];
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                        store.reduceEffect(state, checkProvidedEnergy);
                        const blockedCards = [];
                        checkProvidedEnergy.energyMap.forEach(em => {
                            if (!em.provides.includes(card_types_1.CardType.ANY)) {
                                blockedCards.push(em.card);
                            }
                        });
                        const blocked = [];
                        blockedCards.forEach(bc => {
                            const index = cardList.cards.indexOf(bc);
                            if (index !== -1 && !blocked.includes(index)) {
                                blocked.push(index);
                            }
                        });
                        if (blocked.length !== 0) {
                            blockedMap.push({ source: target, blocked });
                        }
                    });
                    return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], // Only allow moving to active
                        { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, blockedMap }), transfers => {
                            if (!transfers) {
                                return;
                            }
                            for (const transfer of transfers) {
                                // Can only move energy to the active Pokemon
                                const target = player.active;
                                const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                                source.moveCardTo(transfer.card, target);
                                return state;
                            }
                            return state;
                        });
                }
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.IronLeavesex = IronLeavesex;
