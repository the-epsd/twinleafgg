"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aipom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Aipom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Aipom';
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.powers = [{
                name: 'Scampering Tail',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put the top card of your opponent\'s deck on the bottom of their deck without looking at it.'
            }];
        this.attacks = [{
                name: 'Tail Smack',
                cost: [C, C],
                damage: 20,
                text: ''
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '169';
        this.name = 'Aipom';
        this.fullName = 'Aipom CEC';
        this.SCAMPERING_TAIL_MARKER = 'SCAMPERING_TAIL_MARKER';
    }
    reduceEffect(store, state, effect) {
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SCAMPERING_TAIL_MARKER, this);
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            prefabs_1.REMOVE_MARKER(this.SCAMPERING_TAIL_MARKER, player, this);
        }
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.SCAMPERING_TAIL_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (opponent.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            prefabs_1.ADD_MARKER(this.SCAMPERING_TAIL_MARKER, player, this);
            prefabs_1.ABILITY_USED(player, this);
            // Move the top card of the opponent's deck to the bottom of their deck
            const topCard = opponent.deck.cards.shift();
            if (topCard) {
                opponent.deck.cards.push(topCard);
            }
        }
        return state;
    }
}
exports.Aipom = Aipom;
