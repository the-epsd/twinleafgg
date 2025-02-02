"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdos = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const attack_effects_2 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Zapdos extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.name = 'Zapdos';
        this.fullName = 'Zapdos BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 90;
        this.resistance = [{
                type: card_types_1.CardType.FIGHTING,
                value: -30
            }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunder',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Flip a coin. If tails, Zapdos does 30 damage to itself.'
            },
            {
                name: 'Thunderbolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 100,
                text: 'Discard all Energy cards attached to Zapdos in order to use this attack.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            return store.prompt(state, new coin_flip_prompt_1.CoinFlipPrompt(effect.player.id, game_1.GameMessage.COIN_FLIP), (tails) => {
                if (tails) {
                    const damageEffect = new attack_effects_1.DealDamageEffect(effect, 30);
                    damageEffect.target = effect.player.active;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_2.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Zapdos = Zapdos;
