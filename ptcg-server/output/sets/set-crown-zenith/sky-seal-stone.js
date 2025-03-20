"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkySealStone = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_1 = require("../../game/store/state/state");
class SkySealStone extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'CRZ';
        this.setNumber = '143';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sky Seal Stone';
        this.fullName = 'Sky Seal Stone CRZ';
        this.extraPrizes = false;
        this.powers = [
            {
                name: 'Star Order',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                text: 'The Pokémon V this card is attached to can use the VSTAR Power on this card.' +
                    '' +
                    'During your turn, you may use this Ability. During this turn, if your opponent\'s Active Pokémon VSTAR or Active Pokémon VMAX is Knocked Out by damage from an attack from your Basic Pokémon V, take 1 more Prize card. (You can\'t use more than 1 VSTAR Power in a game.) '
            }
        ];
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Add ability to card if attached to a V
        if (effect instanceof check_effects_1.CheckPokemonPowersEffect
            && effect.target.cards.includes(this)
            && !effect.powers.find(p => p.name === this.powers[0].name)) {
            const hasValidCard = effect.target.cards.some(card => card.tags.some(tag => tag === card_types_1.CardTag.POKEMON_V ||
                tag === card_types_1.CardTag.POKEMON_VSTAR ||
                tag === card_types_1.CardTag.POKEMON_VMAX));
            if (!hasValidCard) {
                return state;
            }
            effect.powers.push(this.powers[0]);
            return state;
        }
        // Set extraPrizes to true when power is activated
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            player.usedVSTAR = true;
            this.extraPrizes = true;
            return state;
        }
        // Check conditions for taking an extra prize upon knockout
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Must be basic V, opponent's active must be VSTAR or VMAX
            const attackingPokemon = opponent.active;
            if (this.extraPrizes
                && effect.target === player.active
                && player.active.cards.some(c => c.tags.includes(card_types_1.CardTag.POKEMON_VMAX) || c.tags.includes(card_types_1.CardTag.POKEMON_VSTAR))
                && ((_a = attackingPokemon.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.stage) === card_types_1.Stage.BASIC
                && attackingPokemon.vPokemon()) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                }
                this.extraPrizes = false;
            }
            return state;
        }
        // Remove extra prize effect on turn end
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.extraPrizes = false;
        }
        return state;
    }
}
exports.SkySealStone = SkySealStone;
