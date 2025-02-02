"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyuex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Mimikyuex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Void Return',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
            }, {
                name: 'Energy Burst',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                damageCalculation: 'x',
                text: 'This attack does 30 damage for each Energy attached to both Active Pokémon.'
            }];
        this.set = 'SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Mimikyu ex';
        this.fullName = 'Mimikyu ex SVP';
        this.voidReturn = false;
    }
    reduceEffect(store, state, effect) {
        // Energy Burst
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = (playerEnergyCount + opponentEnergyCount) * 30;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.voidReturn = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.voidReturn == true) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                        if (!selected || selected.length === 0) {
                            return state;
                        }
                        const target = selected[0];
                        player.switchPokemon(target);
                        this.voidReturn = false;
                    });
                }
            });
        }
        return state;
    }
}
exports.Mimikyuex = Mimikyuex;
