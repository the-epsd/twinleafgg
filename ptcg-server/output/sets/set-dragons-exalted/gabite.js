"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gabite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Gabite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Gible';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DRAGON }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dragon Call',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may search your deck for a [N] Pokémon, reveal it, and put it into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Dragonslice',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING],
                damage: 20,
                text: ''
            }
        ];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '89';
        this.name = 'Gabite';
        this.fullName = 'Gabite DRX';
        this.DRAGON_CALL_MARKER = 'DRAGON_CALL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.DRAGON_CALL_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGON_CALL_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.DRAGON_CALL_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.marker.hasMarker(this.DRAGON_CALL_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.DRAGON }, { min: 0, max: 1, allowCancel: true }), cards => {
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                    player.marker.addMarker(this.DRAGON_CALL_MARKER, this);
                });
            });
        }
        return state;
    }
}
exports.Gabite = Gabite;
