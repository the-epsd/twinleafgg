"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kricketot = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
class Kricketot extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Bug Hunch',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for up to 3 [G] Pokémon, reveal them, and put them into your hand. Shuffle your deck afterward.'
            }
        ];
        this.set = 'BKP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Kricketot';
        this.fullName = 'Kricketot BKP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 3, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Kricketot = Kricketot;
