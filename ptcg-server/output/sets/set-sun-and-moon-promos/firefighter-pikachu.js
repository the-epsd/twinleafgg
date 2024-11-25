"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirefighterPikachu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class FirefighterPikachu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Firefighting',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard a [R] Energy from your opponent\'s Active Pokémon.'
            },
            {
                name: 'Quick Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 10 more damage.'
            }
        ];
        this.set = 'SMP';
        this.name = 'Firefighter Pikachu';
        this.fullName = 'Firefighter Pikachu SMP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '209';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasPokemonWithEnergy = false;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.FIRE))) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push();
                }
            });
            if (!hasPokemonWithEnergy) {
                return state;
            }
            const target = opponent.active;
            let cards = [];
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blocked: blocked }), selected => {
                cards = selected || [];
            });
            if (cards.length > 0) {
                // Discard selected special energy card
                target.moveCardsTo(cards, opponent.discard);
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 10;
                }
            });
        }
        return state;
    }
}
exports.FirefighterPikachu = FirefighterPikachu;
