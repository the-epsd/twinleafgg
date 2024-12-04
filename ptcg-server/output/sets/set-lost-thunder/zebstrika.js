"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zebstrika = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Zebstrika extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Blitzle';
        this.powers = [{
                name: 'Sprint',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before you attack), you may discard your hand and draw 4 cards.'
            }];
        this.attacks = [{
                name: 'Head Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'LOT';
        this.setNumber = '82';
        this.name = 'Zebstrika';
        this.fullName = 'Zebstrika LOT';
        this.cardImage = 'assets/cardback.png';
        this.SPRINT_MARKER = 'SPRINT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SPRINT_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SPRINT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SPRINT_MARKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            player.marker.addMarker(this.SPRINT_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 4);
        }
        return state;
    }
}
exports.Zebstrika = Zebstrika;
