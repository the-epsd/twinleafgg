"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eldegoss = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Eldegoss extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gossifleur';
        this.cardType = G;
        this.hp = 80;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Cotton Lift',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may search your deck for up to 2 basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.',
            }];
        this.attacks = [{
                name: 'Cotton Guard',
                cost: [G],
                damage: 30,
                text: 'During your opponent\'s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            },];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Eldegoss';
        this.fullName = 'Eldegoss EVS';
        this.COTTON_LIFT_MARKER = 'COTTON_LIFT_MARKER';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Cotton Lift
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (prefabs_1.HAS_MARKER(this.COTTON_LIFT_MARKER, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ENERGY_FROM_DECK, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: 2, allowCancel: true }), (selections) => {
                if (selections.length === 0) {
                    return prefabs_1.SHUFFLE_DECK(store, state, player);
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, selections);
                prefabs_1.MOVE_CARDS(store, state, player.deck, player.hand, { cards: selections });
                prefabs_1.SHUFFLE_DECK(store, state, player);
                prefabs_1.ADD_MARKER(this.COTTON_LIFT_MARKER, effect.player, this);
                prefabs_1.ABILITY_USED(player, this);
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            if (effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
                effect.damage -= 30;
                return state;
            }
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this && prefabs_1.HAS_MARKER(this.COTTON_LIFT_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.COTTON_LIFT_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && prefabs_1.HAS_MARKER(this.COTTON_LIFT_MARKER, effect.player, this)) {
            prefabs_1.REMOVE_MARKER(this.COTTON_LIFT_MARKER, effect.player, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && (effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this))) {
            effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
            });
        }
        return state;
    }
}
exports.Eldegoss = Eldegoss;
