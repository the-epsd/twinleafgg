"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Honchkrow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Honchkrow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Murkrow';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rip and Run',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Discard a random card from your opponent\'s hand. Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Speed Dive',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Honchkrow';
        this.fullName = 'Honchkrow UPR';
    }
    reduceEffect(store, state, effect) {
        // Rip and Run
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // we rippin
            if (opponent.hand.cards.length === 0) {
                let cards = [];
                store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DECK, opponent.hand, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), selected => {
                    cards = selected || [];
                    opponent.hand.moveCardsTo(cards, opponent.discard);
                });
            }
            // and we runnin
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                player.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.Honchkrow = Honchkrow;
