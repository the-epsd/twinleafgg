"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const card_list_1 = require("../../game/store/state/card-list");
class Pidgeotto extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardType = C;
        this.hp = 60;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Air Mail',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may look at the top 2 cards of your deck and put 1 of them into your hand. Put the other card on the bottom of your deck.'
            }];
        this.attacks = [
            {
                name: 'Gust',
                cost: [C, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Pidgeotto';
        this.fullName = 'Pidgeotto TEU';
        this.AIR_MAIL_MARKER = 'AIR_MAIL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.AIR_MAIL_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.AIR_MAIL_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckBottom = new card_list_1.CardList();
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 2);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: true }), selected => {
                player.marker.addMarker(this.AIR_MAIL_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(deckBottom);
                deckBottom.moveTo(player.deck);
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.AIR_MAIL_MARKER, this);
        }
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;
