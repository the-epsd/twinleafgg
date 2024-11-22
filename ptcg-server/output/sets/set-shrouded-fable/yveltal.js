"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Yveltal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Yveltal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Corrosive Winds',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Put 2 damage counters on each of your opponent\'s Pokemon that has any damage counters on it.'
            },
            {
                name: 'Destructive Beam',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokemon.'
            },
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.setNumber = '35';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Yveltal';
        this.fullName = 'Yveltal SFA';
    }
    reduceEffect(store, state, effect) {
        // Corrosive Winds
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = effect.opponent;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if ((cardList.damage > 0)) {
                    const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, 20);
                    putCountersEffect.target = cardList;
                    store.reduceEffect(state, putCountersEffect);
                }
            });
        }
        // Destructive Beam
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
                return state;
            }
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    let card;
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                        card = selected[0];
                        opponent.active.moveCardTo(card, opponent.discard);
                        return state;
                    });
                }
            });
        }
        return state;
    }
}
exports.Yveltal = Yveltal;
