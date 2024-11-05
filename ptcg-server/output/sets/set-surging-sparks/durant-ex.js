"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Durantex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Durantex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 190;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Sudden Scrape',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand onto your Bench during your turn, you may use this ability. Discard the top card of your opponent\'s deck.'
            }];
        this.attacks = [
            {
                name: 'Revenge Crush',
                cost: [G, C, C],
                damage: 120,
                text: 'This attack does 30 more damage for each Prize Card your opponent has taken.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '4';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Durant ex';
        this.fullName = 'Durant ex SSP';
    }
    reduceEffect(store, state, effect) {
        // Sudden Scrape
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    opponent.deck.moveTo(opponent.discard, 1);
                }
            });
            return state;
        }
        // Revenge Crush
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            effect.damage += (6 - opponent.getPrizeLeft()) * 30;
        }
        return state;
    }
}
exports.Durantex = Durantex;
