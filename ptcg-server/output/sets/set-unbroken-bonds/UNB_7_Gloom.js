"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gloom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gloom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Oddish';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Irresistible Aroma',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: ' Once during your turn (before your attack), if your opponent\'s Bench isn\'t full, you may flip a coin.'
                    + 'If heads, your opponent reveals their hand.Put a Basic Pokémon you find there onto their Bench. '
            }];
        this.attacks = [{
                name: 'Drool',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'UNB';
        this.setNumber = '7';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Gloom';
        this.fullName = 'Gloom UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const slots = opponent.bench.filter(b => b.cards.length === 0);
            if (slots.length === 0) {
                // No open slots, throw error
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            let cards = [];
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.hand, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: true }), selected => {
                        cards = selected || [];
                        if (cards.length === 0) {
                            return state;
                        }
                        cards.forEach((card, index) => {
                            opponent.hand.moveCardTo(card, slots[index]);
                            slots[index].pokemonPlayedTurn = state.turn;
                        });
                    });
                }
            });
        }
        return state;
    }
}
exports.Gloom = Gloom;
