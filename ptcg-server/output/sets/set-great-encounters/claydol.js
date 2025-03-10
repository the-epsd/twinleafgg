"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claydol = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Claydol extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Baltoy';
        this.cardType = F;
        this.hp = 80;
        this.weakness = [{ type: G, value: +20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Cosmic Power',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may choose up to 2 cards from your hand and put them on the bottom of your deck in any order. If you do, draw cards until you have 6 cards in your hand. This power can\’t be used if Claydol is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [F, C],
                damage: 40,
                text: ''
            }];
        this.set = 'GE';
        this.setNumber = '15';
        this.name = 'Claydol';
        this.fullName = 'Claydol GE';
        this.cardImage = 'assets/cardback.png';
        this.COSMIC_POWER_MARKER = 'COSMIC_POWER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.COSMIC_POWER_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.COSMIC_POWER_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.COSMIC_POWER_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.COSMIC_POWER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length == 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckBottom = new game_1.CardList();
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 2 }), selected => {
                player.hand.moveCardsTo(selected, deckBottom);
                deckBottom.moveTo(player.deck);
                while (player.hand.cards.length < 6) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
            });
            player.marker.addMarker(this.COSMIC_POWER_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        return state;
    }
}
exports.Claydol = Claydol;
