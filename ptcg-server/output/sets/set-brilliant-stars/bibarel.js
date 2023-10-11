"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bibarel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Bibarel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.regulationMark = 'F';
        this.evolvesFrom = 'Bidoof';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Industrious Incisors',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As long as this Pokemon is on your Bench, prevent all ' +
                    'damage done to this Pokemon by attacks (both yours and ' +
                    'your opponent\'s).'
            }];
        this.attacks = [{
                name: 'Hyper Fang',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Flip a coin. If tails, this attack does nothing.'
            }];
        this.set = 'BRS';
        this.set2 = 'brilliantstars';
        this.setNumber = '121';
        this.name = 'Bibarel';
        this.fullName = 'Bibarel BRS';
        this.INDUSTRIOUS_INCISORS_MARKER = 'INDUSTRIOUS_INCISORS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.INDUSTRIOUS_INCISORS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            while (player.hand.cards.length < 5) {
                player.deck.moveTo(player.hand, 1);
            }
            player.marker.addMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Bibarel) {
                    player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
        }
        return state;
    }
}
exports.Bibarel = Bibarel;
