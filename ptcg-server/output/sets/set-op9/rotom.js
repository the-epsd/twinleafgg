"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rotom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Rotom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.DARK, value: 20 }];
        this.resistance = [{ type: card_types_1.CardType.COLORLESS, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Type Shift',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may use this ' +
                    'power. Rotom\'s type is P until the end of your turn.'
            }];
        this.attacks = [
            {
                name: 'Poltergeist',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Look at your opponent\'s hand. This attack does 30 damage plus ' +
                    '10 more damage for each Trainer, Supporter, and Stadium card in ' +
                    'your opponent\'s hand.'
            }
        ];
        this.set = 'OP9';
        this.name = 'Rotom';
        this.fullName = 'Rotom OP9';
        this.TYPE_SHIFT_MARKER = 'TYPE_SHIFT_MARKER';
        this.CLEAR_TYPE_SHIFT_MARKER = 'CLEAR_TYPE_SHIFT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList)) {
                return state;
            }
            if (cardList.marker.hasMarker(this.TYPE_SHIFT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.CLEAR_TYPE_SHIFT_MARKER, this);
            cardList.marker.addMarker(this.TYPE_SHIFT_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            return store.prompt(state, new game_1.ShowCardsPrompt(player.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, opponent.hand.cards), () => {
                const trainers = opponent.hand.cards.filter(c => c instanceof game_1.TrainerCard);
                effect.damage += 10 * trainers.length;
            });
        }
        if (effect instanceof check_effects_1.CheckPokemonTypeEffect && effect.target.marker.hasMarker(this.TYPE_SHIFT_MARKER, this)) {
            effect.cardTypes = [card_types_1.CardType.PSYCHIC];
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_TYPE_SHIFT_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.CLEAR_TYPE_SHIFT_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.TYPE_SHIFT_MARKER, this);
            });
        }
        return state;
    }
}
exports.Rotom = Rotom;
