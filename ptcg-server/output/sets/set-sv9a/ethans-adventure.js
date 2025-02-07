"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansAdventure = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansAdventure extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = game_1.TrainerType.SUPPORTER;
        this.tags = [game_1.CardTag.ETHANS];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9a';
        this.setNumber = '63';
        this.name = 'Ethan\'s Adventure';
        this.fullName = 'Ethan\'s Adventure SV9a';
        this.text = 'Search your deck for up to 3 in any combination of Ethan\'s Pokémon and Basic [R] Energy, reveal them, and put them into your hand. Then, shuffle your deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            let ethansPokemonOrFireEnergy = 0;
            const blocked = [];
            player.deck.cards.forEach((c, index) => {
                const isPokemon = c instanceof game_1.PokemonCard && c.tags.includes(game_1.CardTag.ETHANS);
                const isBasicEnergy = c instanceof game_1.EnergyCard && c.energyType === game_1.EnergyType.BASIC && c.name === 'Fire Energy';
                if (isPokemon || isBasicEnergy) {
                    ethansPokemonOrFireEnergy += 1;
                }
                else {
                    blocked.push(index);
                }
            });
            // Player does not have correct cards in discard
            if (ethansPokemonOrFireEnergy === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            effect.preventDefault = true;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, player.discard, {}, { min: 1, max: 3, allowCancel: false, blocked }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                cards.forEach(card => prefabs_1.MOVE_CARD_TO(state, card, player.hand));
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
            player.supporter.moveCardTo(this, player.discard);
        }
        return state;
    }
}
exports.EthansAdventure = EthansAdventure;
