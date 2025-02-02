"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpeko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
class Morpeko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'In A Hungry Hurry',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokemon has no Energy attached to it, this Pokemon has ' +
                    'no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Energizer Wheel',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 70,
                text: 'Move 2 [D] Energy from this Pokémon to 1 of your Benched Pokémon.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Morpeko';
        this.fullName = 'Morpeko PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: pokemon_types_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            if (checkProvidedEnergy.energyMap.length === 0) {
                effect.cost = [];
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' }, { allowCancel: false, min: 2, max: 2, sameTarget: true }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Morpeko = Morpeko;
