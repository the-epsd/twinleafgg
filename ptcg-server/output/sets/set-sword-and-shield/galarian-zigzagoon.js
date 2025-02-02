"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianZigzagoon = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GalarianZigzagoon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Headbutt Tantrum',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may put 1 damage counter on 1 of your opponent\'s Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Surprise Attack',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }
        ];
        this.set = 'SSH';
        this.name = 'Galarian Zigzagoon';
        this.fullName = 'Galarian Zigzagoon SSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = game_1.StateUtils.findOwner(state, effect.target);
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
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 10;
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, damage: 10, target: target.getPokemonCard().name, effect: this.powers[0].name });
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(effect.player.id, game_message_1.GameMessage.COIN_FLIP),
            ], heads => {
                if (heads) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.GalarianZigzagoon = GalarianZigzagoon;
