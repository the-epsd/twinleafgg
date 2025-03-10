"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
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
            prefabs_1.REMOVE_MARKER(this.WISHING_STAR_MARKER, player, this);
            return state;
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.WISHING_STAR_MARKER, this);
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (prefabs_1.HAS_MARKER(this.WISHING_STAR_MARKER, player, this)) {
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
                prefabs_1.ADD_MARKER(this.WISHING_STAR_MARKER, player, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.deck);
                prefabs_1.ABILITY_USED(player, this);
                if (selected.length > 0) {
                    return store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, selected), () => {
                    });
                }
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
