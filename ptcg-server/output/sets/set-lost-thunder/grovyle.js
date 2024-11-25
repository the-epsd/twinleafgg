"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grovyle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Grovyle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Treecko';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sunshine Grace',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a [G] Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Slicing Blade',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 40,
                text: ''
            }
        ];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Grovyle';
        this.fullName = 'Grovyle LOT';
        this.SUNSHINE_GRACE_MARKER = 'SUNSHINE_GRACE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SUNSHINE_GRACE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SUNSHINE_GRACE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.SUNSHINE_GRACE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, player => {
                if (player instanceof Grovyle) {
                    player.marker.removeMarker(this.SUNSHINE_GRACE_MARKER);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Grovyle = Grovyle;
