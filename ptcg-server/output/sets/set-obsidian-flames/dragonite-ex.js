"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragoniteex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Dragoniteex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 330;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }, {
                name: 'Mighty Meteor',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 140,
                text: 'Flip a coin. If heads, this attack does 140 more damage.' +
                    'If tails, during your next turn, this Pokémon can\'t attack.'
            }];
        this.set = 'OBF';
        this.set2 = 'obsidianflames';
        this.setNumber = '159';
        this.name = 'Dragonite ex';
        this.fullName = 'Dragonite ex OBF';
        this.NO_ATTACK_NEXT_TURN_MARKER = 'NO_ATTACK_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 140;
                }
                else {
                    player.marker.addMarker(this.NO_ATTACK_NEXT_TURN_MARKER, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.NO_ATTACK_NEXT_TURN_MARKER)) {
            effect.player.marker.removeMarker(this.NO_ATTACK_NEXT_TURN_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Target is this Squirtle
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_b) {
                    return state;
                }
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Dragoniteex = Dragoniteex;
