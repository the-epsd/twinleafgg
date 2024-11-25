"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ditto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Ditto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Transformative Start',
                powerType: pokemon_types_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your first turn, if this Pokémon is in the Active Spot, you may search your deck and choose a Basic Pokémon you find there, except any Ditto. If you do, discard this Pokémon and all attached cards, and put the chosen Pokémon in its place. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Splup',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            }];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '132';
        this.name = 'Ditto';
        this.fullName = 'Ditto MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Get current turn
            const turn = state.turn;
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const blocked = [];
            player.deck.cards.forEach((card, index) => {
                if (card instanceof pokemon_card_1.PokemonCard && card.name == 'Ditto') {
                    blocked.push(index);
                }
            });
            // Check if it is player's first turn
            if (turn > 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            else {
                let cards = [];
                return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max: 1, allowCancel: true, blocked }), selectedCards => {
                    cards = selectedCards || [];
                    cards.forEach((card) => {
                        effect.player.removePokemonEffects(player.active);
                        player.active.moveTo(player.discard);
                        player.deck.moveCardTo(card, player.active);
                        // const pokemonPlayed = new PlayPokemonEffect(player, card as PokemonCard, player.active);
                        // this.reduceEffect(store, state, pokemonPlayed);
                        player.active.pokemonPlayedTurn = state.turn;
                        effect.player.removePokemonEffects(player.active);
                    });
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
        }
        return state;
    }
}
exports.Ditto = Ditto;
