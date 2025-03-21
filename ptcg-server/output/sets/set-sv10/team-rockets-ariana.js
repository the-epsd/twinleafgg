"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsAriana = void 0;
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
class TeamRocketsAriana extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Team Rocket\'s Ariana';
        this.fullName = 'Team Rocket\'s Ariana SV10';
        this.text = 'Draw cards until you have 5 cards in your hand. If all of your Pokémon in play are Team Rocket\'s Pokemon, draw until you have 8 cards in your hand instead.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const supporterTurn = player.supporterTurn;
            if (supporterTurn > 0) {
                throw new game_error_1.GameError(game_message_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            effect.preventDefault = true;
            // Check if all Pokémon in play are Team Rocket's Pokémon
            let allTeamRocket = true;
            let hasPokemon = false;
            // Check active
            if (player.active.cards.length > 0) {
                hasPokemon = true;
                const activePokemon = player.active.getPokemonCard();
                if (!activePokemon ||
                    !activePokemon.tags ||
                    !activePokemon.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                    allTeamRocket = false;
                }
            }
            // Check bench
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList !== player.active && card instanceof pokemon_card_1.PokemonCard) {
                    hasPokemon = true;
                    if (!card.tags || !card.tags.includes(card_types_1.CardTag.TEAM_ROCKET)) {
                        allTeamRocket = false;
                    }
                }
            });
            // Set target hand size
            const targetHandSize = (hasPokemon && allTeamRocket) ? 8 : 5;
            // Draw until target hand size is reached
            while (player.hand.cards.length < targetHandSize) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return state;
        }
        return state;
    }
}
exports.TeamRocketsAriana = TeamRocketsAriana;
