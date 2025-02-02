"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Morpeko = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const confirm_cards_prompt_1 = require("../../game/store/prompts/confirm-cards-prompt");
class Morpeko extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Snack Seek',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may look at the top card of your deck. You may discard that card.'
            }
        ];
        this.attacks = [
            {
                name: 'Pick and Stick',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 0,
                text: 'Attach up to 2 Basic Energy cards from your discard pile to your Pokémon in any way you like.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '72';
        this.name = 'Morpeko';
        this.fullName = 'Morpeko TWM';
        this.SNACK_SEARCH_MARKER = 'SNACK_SEARCH_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SNACK_SEARCH_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SNACK_SEARCH_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SNACK_SEARCH_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 1);
            player.marker.addMarker(this.SNACK_SEARCH_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return store.prompt(state, new confirm_cards_prompt_1.ConfirmCardsPrompt(player.id, game_1.GameMessage.DISCARD_FROM_TOP_OF_DECK, deckTop.cards, // Fix error by changing toArray() to cards
            { allowCancel: true }), selected => {
                if (selected !== null) {
                    // Discard card
                    deckTop.moveCardsTo(deckTop.cards, player.discard);
                }
                else {
                    // Move back to the top of your deck
                    deckTop.moveToTopOfDestination(player.deck);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 1, max: 2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Morpeko = Morpeko;
