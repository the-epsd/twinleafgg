"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bulbasaur = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Bulbasaur extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Find a Friend',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Search your deck for a G Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.',
            }
        ];
        this.set = 'DET';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Bulbasaur';
        this.fullName = 'Bulbasaur DET';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.GRASS }, { min: 0, max: 1, allowCancel: false }), selectedCards => {
                cards = selectedCards || [];
                cards.forEach((card, index) => {
                    player.deck.moveCardTo(card, player.hand);
                    return state;
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Bulbasaur = Bulbasaur;
