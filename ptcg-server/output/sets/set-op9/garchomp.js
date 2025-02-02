"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Garchomp = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Garchomp extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Gabite';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.COLORLESS, value: 30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Dragon Rage',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Flip 2 coins. If either of them is tails, this attack does nothing.'
            },
            {
                name: 'Jet Sword',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Discard 2 Energy attached to Garchomp and this attack does 10 ' +
                    'damage to each of your opponent\'s Benched Pokemon. (Don\'t apply ' +
                    'Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.set = 'OP9';
        this.name = 'Garchomp';
        this.fullName = 'Garchomp OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results.some(r => r === false)) {
                    effect.damage = 0;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                store.reduceEffect(state, discardEnergy);
            });
            opponent.bench.forEach(benched => {
                if (benched.cards.length > 0) {
                    const dealDamage = new attack_effects_1.PutDamageEffect(effect, 10);
                    dealDamage.target = benched;
                    return store.reduceEffect(state, dealDamage);
                }
            });
        }
        return state;
    }
}
exports.Garchomp = Garchomp;
