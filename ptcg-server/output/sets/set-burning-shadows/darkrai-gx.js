"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkraiGX = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class DarkraiGX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.DARK;
        this.tags = [game_1.CardTag.POKEMON_GX];
        this.stage = game_1.Stage.BASIC;
        this.hp = 180;
        this.weakness = [{ type: game_1.CardType.FIGHTING }];
        this.resistance = [{ type: game_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Restoration',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is in your discard pile, you may put it onto your Bench. Then, attach a [D] Energy card from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Dark Cleave',
                cost: [game_1.CardType.DARK, game_1.CardType.DARK, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            },
            {
                name: 'Dead End-GX',
                cost: [game_1.CardType.DARK, game_1.CardType.DARK, game_1.CardType.COLORLESS],
                damage: 0,
                gxAttack: true,
                text: 'If your opponent\'s Active Pokémon is affected by a Special Condition, that Pokémon is Knocked Out. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'BUS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Darkrai-GX';
        this.fullName = 'Darkrai-GX BUS';
        this.NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            console.log('Number of bench slots open: ' + slots.length);
            // Check if card is in the discard
            if (!player.discard.cards.includes(this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Power already used
            if (player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // No open slots, throw error
            if (slots.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Add Marker (similar to propagation exeggcute, you can use this as much as you want)
            // source: https://compendium.pokegym.net/category/4-abilities/restoration/
            //player.marker.addMarker(this.NETHERWORLD_GATE_MARKER, this);
            const cards = player.discard.cards.filter(c => c === this);
            cards.forEach((card, index) => {
                player.discard.moveCardTo(card, slots[index]);
            });
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC
                    && c.provides.includes(game_1.CardType.DARK);
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            let hasDarkraiGXOnBench = false;
            const blockedTo = [];
            player.bench.forEach((bench, index) => {
                if (bench.cards.length === 0) {
                    return;
                }
                const pokemonCard = bench.getPokemonCard();
                if (pokemonCard instanceof DarkraiGX) {
                    hasDarkraiGXOnBench = true;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (hasDarkraiGXOnBench) {
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Darkness Energy' }, { allowCancel: false, min: 0, max: 1, blockedTo }), transfers => {
                    transfers = transfers || [];
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
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const opponentActive = opponent.active;
            if (opponentActive instanceof game_1.PokemonCardList) {
                const activePokemon = opponentActive.getPokemonCard();
                if (!activePokemon) {
                    return state;
                }
                if (activePokemon) {
                    const hasSpecialCondition = opponentActive.specialConditions.some(condition => condition !== game_1.SpecialCondition.ABILITY_USED);
                    if (hasSpecialCondition) {
                        opponentActive.specialConditions = opponentActive.specialConditions.filter(condition => condition === game_1.SpecialCondition.ABILITY_USED);
                        const dealDamage = new attack_effects_1.KnockOutOpponentEffect(effect, 999);
                        dealDamage.target = opponent.active;
                        store.reduceEffect(state, dealDamage);
                    }
                }
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
            effect.player.marker.removeMarker(this.NETHERWORLD_GATE_MARKER, this);
        }
        return state;
    }
}
exports.DarkraiGX = DarkraiGX;
