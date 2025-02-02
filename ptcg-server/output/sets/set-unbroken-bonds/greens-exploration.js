"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreensExploration = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GreensExploration extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '175';
        this.name = 'Green\'s Exploration';
        this.fullName = 'Green\'s Exploration UNB';
        this.text = 'You can play this card only if you have no Pokémon with Abilities in play.' +
            '' +
            'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let benchPokemon = [];
            const pokemonWithAbilities = [];
            const playerActive = player.active.getPokemonCard();
            const stubPowerEffectForActive = new game_effects_1.PowerEffect(player, {
                name: 'test',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }, player.active.getPokemonCard());
            try {
                store.reduceEffect(state, stubPowerEffectForActive);
                if (playerActive && playerActive.powers.length) {
                    pokemonWithAbilities.push(playerActive);
                }
            }
            catch (_a) {
                // no abilities in active
            }
            if (player.bench.some(b => b.cards.length > 0)) {
                const stubPowerEffectForBench = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, player.bench.filter(b => b.cards.length > 0)[0].getPokemonCard());
                try {
                    store.reduceEffect(state, stubPowerEffectForBench);
                    benchPokemon = player.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
                    pokemonWithAbilities.push(...benchPokemon.filter(card => card.powers.length));
                }
                catch (_b) {
                    // no abilities on bench
                }
            }
            if (pokemonWithAbilities.length > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.deck.moveCardsTo(cards, player.hand);
                    state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                }
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.GreensExploration = GreensExploration;
