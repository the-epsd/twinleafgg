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
                const valid = evolutions.filter(e => e.evolvesFrom === card.name && e.stage === card.stage + 1);
                valid.forEach(c => {
                    if (!evolutionNames.includes(c.name)) {
                        evolutionNames.push(c.name);
                    }
                });
            });
            if (opponent.active.getPokemonCard()) {
                const activeEvolutions = opponent.active.cards.filter(card => evolutionNames.includes(card.name));
                opponent.active.moveCardsTo(activeEvolutions, opponent.hand);
            }
            opponent.bench.forEach(benchSpot => {
                if (benchSpot.getPokemonCard()) {
                    const benchEvolutions = benchSpot.cards.filter(card => evolutionNames.includes(card.name));
                    benchSpot.moveCardsTo(benchEvolutions, opponent.hand);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool) {
            const player = effect.player;
            const tool = effect.player.active.tool;
            if (tool.name === this.name) {
                player.active.moveCardTo(tool, player.discard);
                player.active.tool = undefined;
            }
            return state;
        }
        return state;
    }
}
exports.TechnicalMachineDevolution = TechnicalMachineDevolution;
