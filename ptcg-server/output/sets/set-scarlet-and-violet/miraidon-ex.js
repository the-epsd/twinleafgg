"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidonex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Miraidonex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tandem Unit',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for up ' +
                    'to 2 Basic L Pokémon and put them onto your Bench. ' +
                    'Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Photon Blaster',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'SVI';
        this.name = 'Miraidon ex';
        this.fullName = 'Miraidon ex SVI';
        this.TANDEM_UNIT_MARKER = 'TANDEM_UNIT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TANDEM_UNIT_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.TANDEM_UNIT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.TANDEM_UNIT_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const slots = player.bench.filter(b => b.cards.length === 0);
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if bench has open slots
            const openSlots = player.bench.filter(b => b.cards.length === 0);
            if (openSlots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, cardType: card_types_1.CardType.LIGHTNING }, { min: 0, max: 2, allowCancel: true }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                    player.marker.addMarker(this.TANDEM_UNIT_MARKER, this);
                    return state;
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                        effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                            if (player instanceof Miraidonex) {
                                player.marker.removeMarker(this.TANDEM_UNIT_MARKER);
                                return state;
                            }
                        });
                        return state;
                    }
                    return state;
                });
            });
        }
        return state;
    }
}
exports.Miraidonex = Miraidonex;
