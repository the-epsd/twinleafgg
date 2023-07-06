"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazamex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const state_utils_1 = require("../../game/store/state-utils");
class Alakazamex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        //public evolvesFrom = 'Alakazam';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Mind Jack',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            },
            {
                name: 'Dimensional Manipulation',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'You may use this attack even if this Pokemon is on the Bench.'
            }
        ];
        this.set = '151';
        this.name = 'Alakazam ex';
        this.fullName = 'Alakazam ex MEW 065';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_STARTING_POKEMONS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH]), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const attackEffect = new game_effects_1.AttackEffect(player, opponent, this.attacks[1]);
                return store.reduceEffect(state, attackEffect);
            });
        }
        return state;
    }
}
exports.Alakazamex = Alakazamex;
