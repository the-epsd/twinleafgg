"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garbodor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
// GRI Garbodor 51 (https://limitlesstcg.com/cards/GRI/51)
class Garbodor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Trubbish';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trashalanche',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 20,
                text: 'This attack does 20 damage for each Item card in your opponent\'s discard pile.'
            },
            {
                name: 'Acid Spray',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'GRI';
        this.setNumber = '51';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Garbodor';
        this.fullName = 'Garbodor GRI';
    }
    reduceEffect(store, state, effect) {
        // Trashalanche
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let opponentItems = 0;
            opponent.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.ITEM) {
                    opponentItems += 1;
                }
            });
            effect.damage = opponentItems * 20;
        }
        // Acid Spray
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                    if (flipResult) {
                        // Defending Pokemon has no energy cards attached
                        if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                            return state;
                        }
                        let cards = [];
                        return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                            return store.reduceEffect(state, discardEnergy);
                        });
                    }
                });
            }
        }
        return state;
    }
}
exports.Garbodor = Garbodor;
