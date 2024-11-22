"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gastly = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Gastly extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.attacks = [{
                name: 'Lick',
                cost: [P],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed'
            },
            {
                name: 'Energy Conversion',
                cost: [P, P],
                damage: 0,
                text: 'Put up to 2 Energy cards from your discard pile into your hand. Gastly does 10 damage to itself.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Gastly';
        this.fullName = 'Gastly FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let energyCards = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard) {
                    energyCards++;
                }
            });
            if (energyCards === 0) {
                return state;
            }
            const min = Math.min(energyCards, 2);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.ENERGY }, { min, max: min, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    // Recover discarded Pokemon
                    player.discard.moveCardsTo(cards, player.hand);
                }
            });
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Gastly = Gastly;
