"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineDevolution = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TechnicalMachineDevolution extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '177';
        this.name = 'Technical Machine: Devolution';
        this.fullName = 'Technical Machine: Devolution PAR';
        this.attacks = [{
                name: 'Devolution',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Devolve each of your opponent\'s evolved Pokémon by putting the highest Stage Evolution card on it into your opponent\'s hand.'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    cardList.tool = undefined;
                }
            });
            return state;
        }
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const reduction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < reduction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Look through all known cards to find out if Pokemon can evolve
            const cm = game_1.CardManager.getInstance();
            const evolutions = cm.getAllCards().filter(c => {
                return c instanceof game_1.PokemonCard && c.stage !== card_types_1.Stage.BASIC;
            });
            // Build possible evolution card names
            const evolutionNames = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (list, card, target) => {
                const valid = evolutions.filter(e => e.evolvesFrom === card.name);
                valid.forEach(c => {
                    if (!evolutionNames.includes(c.name)) {
                        evolutionNames.push(c.name);
                    }
                });
            });
            if (opponent.active.getPokemonCard()) {
                const activePokemon = opponent.active.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
                if (activePokemon.length > 0) {
                    let lastPlayedPokemonIndex = activePokemon.length - 1;
                    while (lastPlayedPokemonIndex >= 0 && activePokemon[lastPlayedPokemonIndex] instanceof game_1.PokemonCard && activePokemon[lastPlayedPokemonIndex].stage === card_types_1.Stage.BASIC) {
                        lastPlayedPokemonIndex--;
                    }
                    if (lastPlayedPokemonIndex >= 0) {
                        const lastPlayedPokemon = activePokemon[lastPlayedPokemonIndex];
                        opponent.active.moveCardTo(lastPlayedPokemon, opponent.hand);
                    }
                }
            }
            opponent.bench.forEach(benchSpot => {
                if (benchSpot.getPokemonCard()) {
                    const benchPokemon = benchSpot.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
                    if (benchPokemon.length > 0) {
                        let lastPlayedPokemonIndex = benchPokemon.length - 1;
                        while (lastPlayedPokemonIndex >= 0 && benchPokemon[lastPlayedPokemonIndex] instanceof game_1.PokemonCard && benchPokemon[lastPlayedPokemonIndex].stage === card_types_1.Stage.BASIC) {
                            lastPlayedPokemonIndex--;
                        }
                        if (lastPlayedPokemonIndex >= 0) {
                            const lastPlayedPokemon = benchPokemon[lastPlayedPokemonIndex];
                            benchSpot.moveCardTo(lastPlayedPokemon, opponent.hand);
                        }
                    }
                }
            });
        }
        return state;
    }
}
exports.TechnicalMachineDevolution = TechnicalMachineDevolution;
