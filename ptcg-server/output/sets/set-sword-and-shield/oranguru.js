"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oranguru = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Oranguru extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.powers = [{
                name: 'Primate Wisdom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may switch a card from your hand ' +
                    'with the top card of your deck.'
            }];
        this.attacks = [
            {
                name: 'Whap Down',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SSH';
        this.setNumber = '148';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oranguru';
        this.fullName = 'Oranguru SSH';
        this.PRIMATE_WISDOM_MARKER = 'PRIMATE_WISDOM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PRIMATE_WISDOM_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0 || player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.PRIMATE_WISDOM_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.hand, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    player.deck.moveTo(player.hand, 1);
                    const index = player.hand.cards.indexOf(cards[0]);
                    if (index !== -1) {
                        player.hand.cards.splice(index, 1);
                        player.deck.cards.unshift(cards[0]);
                    }
                    player.marker.addMarker(this.PRIMATE_WISDOM_MARKER, this);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PRIMATE_WISDOM_MARKER, this);
        }
        return state;
    }
}
exports.Oranguru = Oranguru;
