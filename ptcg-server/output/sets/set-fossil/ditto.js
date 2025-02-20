"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 50;
        this.resistance = [{ type: P, value: -30 }];
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [];
        this.powers = [{
                name: 'Transform',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'If Ditto is your Active Pokémon, treat it as if it were the same card as the Defending Pokémon, including type, Hit Points, Weakness, and so on, except Ditto can\'t evolve, always has this Pokémon Power, and you may treat any Energy attached to Ditto as Energy of any type. Ditto isn\'t a copy of any other Pokémon while Ditto is Asleep, Confused, or Paralyzed.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Ditto';
        this.fullName = 'Ditto FO';
    }
    reduceEffect(store, state, effect) {
        // Handle HP check
        if (effect instanceof check_effects_1.CheckHpEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveHP = new check_effects_1.CheckHpEffect(opponent, opponent.active);
            effect.hp = opponentActiveHP.hp; // Set Ditto's HP to opponent's active HP
        }
        // Handle Retreat Cost check
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActiveRetreat = new check_effects_1.CheckRetreatCostEffect(opponent);
            effect.cost = opponentActiveRetreat.cost; // Set Ditto's retreat cost to opponent's
        }
        // Handle Attack checks
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentAttacks = new check_effects_1.CheckPokemonAttacksEffect(opponent);
            // Copy opponent's attacks to effect.attacks instead of this.attacks
            effect.attacks = [...opponentAttacks.attacks];
        }
        // Handle Power checks
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentPowers = new check_effects_1.CheckPokemonPowersEffect(player, opponent.active);
            // Logic to copy opponent's powers to Ditto's powers
            this.powers = [...opponentPowers.powers]; // Example of copying powers
        }
        return state; // Return the updated state
    }
}
exports.Ditto = Ditto;
