"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Garbodor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trubbish';
        this.cardType = P;
        this.hp = 100;
        this.weakness = [{ type: P }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Garbotoxin',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokemon has a Pokemon Tool card attached to it, each Pokemon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities (except for Garbotoxin).'
            }];
        this.attacks = [{
                name: 'Offensive Bomb',
                cost: [P, C, C, C],
                damage: 60,
                text: 'Your opponent\'s Active Pokemon is now Confused and Poisoned.'
            }];
        this.set = 'BKP';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '57';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === pokemon_types_1.PowerType.ABILITY
            && effect.power.name !== 'Garbotoxin') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isGarbodorWithToolInPlay = false;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGarbodorWithToolInPlay = true;
                }
            });
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this && cardList.tool !== undefined) {
                    isGarbodorWithToolInPlay = true;
                }
            });
            if (!isGarbodorWithToolInPlay) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Offensive Bomb
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
            prefabs_1.ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
        return state;
    }
}
exports.Garbodor = Garbodor;
