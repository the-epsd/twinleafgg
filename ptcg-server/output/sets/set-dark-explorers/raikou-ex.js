"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaikouEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
class RaikouEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunder Fang',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
            }, {
                name: 'Volt Bolt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard all L Energy attached to this Pokemon. This attack ' +
                    'does 100 damage to 1 of your opponent\'s Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
        ];
        this.set = 'DEX';
        this.name = 'Raikou EX';
        this.fullName = 'Raikou EX DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialCondition);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = effect.opponent;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = [];
            checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.includes(card_types_1.CardType.LIGHTNING) || em.provides.includes(card_types_1.CardType.ANY)) {
                    cards.push(em.card);
                }
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.includes(opponent.active)) {
                    effect.damage = 100;
                    return;
                }
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        return state;
    }
}
exports.RaikouEx = RaikouEx;
