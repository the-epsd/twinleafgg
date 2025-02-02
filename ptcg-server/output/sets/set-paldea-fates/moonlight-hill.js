"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoonlightHill = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MoonlightHill extends game_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '81';
        this.trainerType = game_1.TrainerType.STADIUM;
        this.set = 'PAF';
        this.name = 'Moonlit Hill';
        this.fullName = 'Moonlit Hill PAF';
        this.text = 'Once during each player’s turn, that play may discard a Basic [P] Energy from their hand. If they do, they may heal 30 damage from each of their Pokémon.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            return this.useStadium(store, state, effect);
        }
        return state;
    }
    useStadium(store, state, effect) {
        const player = effect.player;
        if (effect instanceof game_effects_1.UseStadiumEffect && game_1.StateUtils.getStadiumCard(state) === this) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_STADIUM);
        }
        const hasEnergyInHand = player.hand.cards.some(c => {
            return c instanceof game_1.EnergyCard;
        });
        if (!hasEnergyInHand) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
        }
        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: game_1.SuperType.ENERGY, cardType: game_1.CardType.PSYCHIC }, { allowCancel: true, min: 1, max: 1 }), cards => {
            cards = cards || [];
            if (cards.length === 0) {
                return;
            }
            // Heal each Pokemon by 10 damage
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const healEffect = new game_effects_1.HealEffect(player, cardList, 30);
                state = store.reduceEffect(state, healEffect);
            });
            return state;
        });
        return state;
    }
}
exports.MoonlightHill = MoonlightHill;
