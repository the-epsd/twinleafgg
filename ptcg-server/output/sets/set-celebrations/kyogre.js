"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kyogre = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Kyogre extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Aqua Storm',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard the top 5 cards of your deck, and then choose 2 of your opponent\'s Benched Pokémon. This attack does 50 damage for each Energy card you discarded in this way to each of those Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Surf',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: ''
            }
        ];
        this.set = 'CEL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '3';
        this.name = 'Kyogre';
        this.fullName = 'Kyogre CEL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            const deckTop = new card_list_1.CardList();
            // Move top 5 cards from deckTop
            player.deck.moveTo(deckTop, 5);
            // Filter for Basic Energy cards
            const basicEnergy = deckTop.cards.filter(c => c instanceof game_1.EnergyCard &&
                c.energyType === card_types_1.EnergyType.BASIC);
            // Move all cards to discard
            deckTop.moveTo(player.discard, deckTop.cards.length);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += basicEnergy.length * 50;
                });
                return state;
            });
        }
        return state;
    }
}
exports.Kyogre = Kyogre;
