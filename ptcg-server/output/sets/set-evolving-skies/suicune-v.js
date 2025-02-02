"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuicuneV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SuicuneV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Fleet-Footed',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active Spot, ' +
                    'you may draw a card.'
            }];
        this.attacks = [
            {
                name: 'Blizzard Rondo',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Benched ' +
                    'Pokémon (both yours and your opponent\'s).'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Suicune V';
        this.fullName = 'Suicune V EVS';
        this.FLEET_FOOTED_MARKER = 'FLEET_FOOTED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.FLEET_FOOTED_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.FLEET_FOOTED_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.FLEET_FOOTED_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.FLEET_FOOTED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            // Draw a card
            player.deck.moveTo(player.hand, 1);
            player.marker.addMarker(this.FLEET_FOOTED_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const totalBenched = playerBenched + opponentBenched;
            effect.damage = 20 + totalBenched * 20;
        }
        return state;
    }
}
exports.SuicuneV = SuicuneV;
