"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlolanMuk = void 0;
const game_1 = require("../../game");
const game_error_1 = require("../../game/game-error");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_card_list_1 = require("../../game/store/state/pokemon-card-list");
class AlolanMuk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Alolan Grimer';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Power of Alchemy',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Each Basic Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities.'
            }];
        this.attacks = [{
                name: 'Crunch',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }];
        this.set = 'SUM';
        this.name = 'Alolan Muk';
        this.fullName = 'Alolan Muk SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                        return state;
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === pokemon_types_1.PowerType.ABILITY && effect.power.name !== 'Power of Alchemy') {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            let isAlolanMukInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAlolanMukInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAlolanMukInPlay = true;
                }
            });
            if (!isAlolanMukInPlay) {
                return state;
            }
            const cardList = state_utils_1.StateUtils.findCardList(state, effect.card);
            if (cardList instanceof pokemon_card_list_1.PokemonCardList) {
                const checkPokemonType = new check_effects_1.CheckPokemonTypeEffect(cardList);
                store.reduceEffect(state, checkPokemonType);
            }
            // We are not blocking the Abilities from Non-Basic Pokemon
            if (effect.card.stage !== card_types_1.Stage.BASIC) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_error_1.GameError(game_message_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.AlolanMuk = AlolanMuk;
