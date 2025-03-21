"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Celebi = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Celebi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Sparkle Motion',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Put 1 damage counter on each of your opponent\'s Pokémon.'
            }];
        this.powers = [{
                name: 'θ Stop',
                text: 'Prevent all effects of your opponent\'s Pokémon\'s Abilities done to this Pokémon.',
                powerType: game_1.PowerType.ANCIENT_TRAIT,
                useWhenInPlay: false,
            }, {
                name: 'Leap Through Time',
                text: 'When this Pokémon is Knocked Out, flip a coin. If heads, your opponent can\'t take a Prize card. Shuffle this Pokémon and all cards attached to it into your deck.',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: false,
            }];
        this.set = 'XYP';
        this.setNumber = '93';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Celebi';
        this.fullName = 'Celebi XYP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            try {
                const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
                store.reduceEffect(state, coinFlip);
            }
            catch (_b) {
                return state;
            }
            const coinFlipResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
            if (coinFlipResult) {
                effect.prizeCount = 0;
                player.active.clearEffects();
                player.active.moveTo(player.deck);
                store.log(state, game_1.GameLog.LOG_SHUFFLE_POKEMON_INTO_DECK, { name: player.name, card: this.name, effect: this.powers[0].name });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.PUT_X_DAMAGE_COUNTERS_ON_ALL_YOUR_OPPONENTS_POKEMON(1, store, state, effect);
        }
        return state;
    }
}
exports.Celebi = Celebi;
