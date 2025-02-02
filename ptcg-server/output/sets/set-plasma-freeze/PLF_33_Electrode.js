"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Electrode = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Electrode extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Voltorb';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Magnetic Draw',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may draw cards until you have 4 cards in your hand. '
            }];
        this.attacks = [{
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'PLF';
        this.setNumber = '33';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Electrode';
        this.fullName = 'Electrode PLF';
        this.MAGNETIC_DRAW_MARKER = 'MAGNETIC_DRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.MAGNETIC_DRAW_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.MAGNETIC_DRAW_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.MAGNETIC_DRAW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            while (player.hand.cards.length < 4) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
            player.marker.addMarker(this.MAGNETIC_DRAW_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Electrode) {
                    player.marker.removeMarker(this.MAGNETIC_DRAW_MARKER);
                }
            });
        }
        return state;
    }
}
exports.Electrode = Electrode;
