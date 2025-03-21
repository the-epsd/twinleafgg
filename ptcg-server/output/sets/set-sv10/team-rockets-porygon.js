"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsPorygon = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const state_utils_1 = require("../../game/store/state-utils");
const game_message_1 = require("../../game/game-message");
class TeamRocketsPorygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TEAM_ROCKET];
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Hacking',
                cost: [C],
                damage: 0,
                text: 'Discard 1 card from your hand. Then your opponent discards 1 card from their hand.'
            }
        ];
        this.regulationMark = 'I';
        this.set = 'SV10';
        this.setNumber = '81';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Team Rocket\'s Porygon';
        this.fullName = 'Team Rocket\'s Porygon SV10';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Player chooses 1 card to discard
            if (player.hand.cards.length > 0) {
                return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                    cards = cards || [];
                    // Discard the selected card
                    player.hand.moveCardsTo(cards, player.discard);
                    // Then opponent chooses 1 card to discard
                    if (opponent.hand.cards.length > 0) {
                        return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(opponent, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: 1, max: 1 }), oppCards => {
                            oppCards = oppCards || [];
                            // Discard the opponent's selected card
                            opponent.hand.moveCardsTo(oppCards, opponent.discard);
                            return state;
                        });
                    }
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.TeamRocketsPorygon = TeamRocketsPorygon;
