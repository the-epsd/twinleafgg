"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wishing Star',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), if Jirachi is your Active Pokémon, you may look at the top 5 cards of your deck, choose 1 of them, and put it into your hand. Shuffle your deck afterward. Jirachi and your other Active Pokémon, if any, are now Asleep. This power can\’t be used if Jirachi is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Metallic Blow',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If the Defending Pokémon has any Poké-Bodies, this attack does 20 damage plus 30 more damage.'
            }];
        this.set = 'DX';
        this.setNumber = '9';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi DX';
        this.WISHING_STAR_MARKER = 'WISHING_STAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const target = opponent.active.getPokemonCard();
            if (target !== undefined && target.powers.some(power => power.powerType === pokemon_types_1.PowerType.POKEBODY)) {
                if (!prefabs_1.IS_POKEBODY_LOCKED(store, state, player, target)) {
                    effect.damage += 30;
                }
            }
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.WISHING_STAR_MARKER, this);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.WISHING_STAR_MARKER, this)) {
            effect.player.marker.removeMarker(this.WISHING_STAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.WISHING_STAR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            if (player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 5);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                player.marker.addMarker(this.WISHING_STAR_MARKER, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        cardList.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                    }
                });
                if (selected.length > 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
