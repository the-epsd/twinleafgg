"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Togekiss = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Togekiss extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Togetic';
        this.cardType = P;
        this.hp = 140;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Wonder Kiss',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent\'s Active Pokémon gets Knocked Out, flip a coin. If heads, take 1 more Prize card for that Knock Out. This Ability does not stack.'
            }];
        this.attacks = [
            {
                name: 'Speed Wing',
                cost: [C, C, C],
                damage: 140,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '47';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Togekiss';
        this.fullName = 'Togekiss SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Check if this card is in play (active or bench)
            const isInPlay = opponent.active.cards.includes(this) || opponent.bench.some(b => b.cards.includes(this));
            if (!isInPlay) {
                return state;
            }
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            // Check if ability has already been activated for this knockout
            if (player.marker.hasMarker('TOGEKISS_KNOCKOUT_FLIP')) {
                return state;
            }
            // Mark ability as used for this knockout
            player.marker.addMarkerToState('TOGEKISS_KNOCKOUT_FLIP');
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(opponent.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    //If Heads, take 1 more Prize card for that Knock Out
                    effect.prizeCount += 1;
                }
                // Remove the marker after the coin flip
                player.marker.removeMarker('TOGEKISS_KNOCKOUT_FLIP');
            });
        }
        return state;
    }
}
exports.Togekiss = Togekiss;
