"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanOfWaves = void 0;
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
class FanOfWaves extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '127';
        this.name = 'Fan of Waves';
        this.fullName = 'Fan of Waves BST';
        this.text = 'Put a Special Energy attached to 1 of your opponent\'s Pokémon on the bottom of their deck.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY && card_types_1.EnergyType.SPECIAL)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let targets = [];
            state = store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
                targets = results || [];
            });
            if (targets.length === 0) {
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                return state;
            }
            const target = targets[0];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                const cards = selected;
                const opponentDeckBottom = new game_1.CardList();
                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                cards.forEach(card => {
                    opponentDeckBottom.moveCardTo(card, opponent.deck);
                    player.supporter.moveCardTo(this, player.discard);
                });
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.FanOfWaves = FanOfWaves;
