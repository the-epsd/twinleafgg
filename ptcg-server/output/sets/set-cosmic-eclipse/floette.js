"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floette = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Floette extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.evolvesFrom = 'Flabébé';
        this.powers = [{
                name: 'Flower Picking',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may choose a random card from your opponent\'s hand.Your opponent reveals that card and shuffles it into their deck.'
            }];
        this.attacks = [{
                name: 'Magical Shot',
                cost: [Y, C],
                damage: 30,
                text: ''
            }];
        this.set = 'CEC';
        this.name = 'Floette';
        this.fullName = 'Floette CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '151';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.deck);
                store.prompt(state, [
                    new game_1.ShuffleDeckPrompt(opponent.id)
                ], deckOrder => {
                    opponent.deck.applyOrder(deckOrder);
                });
            }
        }
        return state;
    }
}
exports.Floette = Floette;
