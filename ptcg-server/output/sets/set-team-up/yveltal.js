"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Derail',
                cost: [card_types_1.CardType.DARK],
                damage: 30,
                text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Clutch',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 60,
                text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal TEU';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect &&
            effect.player.active.marker.hasMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            const player = effect.player;
            player.active.marker.removeMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const specialEnergy = opponent.active.cards.filter(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL);
            if (specialEnergy.length === 0) {
                return state;
            }
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    opponent.active.moveCardsTo(cards, opponent.discard);
                }
            });
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
