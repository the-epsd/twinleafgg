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
        var _a, _b, _c;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (((_c = (_b = opponent.active) === null || _b === void 0 ? void 0 : _b.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.stage) != card_types_1.Stage.BASIC) {
                const latestEvolution = opponent.active.cards[opponent.active.cards.length - 1];
                opponent.active.moveCardsTo([latestEvolution], opponent.hand);
                opponent.active.clearEffects();
            }
            opponent.bench.forEach(benchSpot => {
                var _a;
                if (((_a = benchSpot.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) != card_types_1.Stage.BASIC) {
                    const latestEvolution = benchSpot.cards[benchSpot.cards.length - 1];
                    benchSpot.moveCardsTo([latestEvolution], opponent.hand);
                    benchSpot.clearEffects();
                }
            });
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
        return state;
    }
}
exports.TechnicalMachineDevolution = TechnicalMachineDevolution;
