"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pidgeot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Pidgeotto';
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [];
        this.powers = [{
                name: 'Quick Search',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may choose any 1 card from your deck and put it into your hand. Shuffle your deck afterward. You can\’t use more than 1 Quick Search Poké-Power each turn. This power can\’t be used if Pidgeot is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Clutch',
                cost: [C, C],
                damage: 40,
                text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
            }];
        this.set = 'RG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '10';
        this.name = 'Pidgeot';
        this.fullName = 'Pidgeot RG';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
        this.QUICK_SEARCH_POWER_MARKER = 'QUICK_SEARCH_POWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.QUICK_SEARCH_POWER_MARKER, player)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ADD_MARKER(this.QUICK_SEARCH_POWER_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, opponent.active, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && prefabs_1.HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, effect.player.active, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.QUICK_SEARCH_POWER_MARKER, this);
        prefabs_1.REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        return state;
    }
}
exports.Pidgeot = Pidgeot;
