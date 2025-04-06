"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragoniumZDragonClaw = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class DragoniumZDragonClaw extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.tags = [];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '190';
        this.name = 'Dragonium Z: Dragon Claw';
        this.fullName = 'Dragonium Z: Dragon Claw CEC';
        this.attacks = [{
                name: 'Destructive Drake',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                damageCalculation: 'x',
                text: 'Discard all basic Energy from this Pokémon. This attack does 80 damage for each card you discarded in this way. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.text = 'If the Pokémon this card is attached to has the Dragon Claw attack, it can use the GX attack on this card. (You still need the necessary Energy to use this attack.)';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const reduction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < reduction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.includes(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (prefabs_1.IS_TOOL_BLOCKED(store, state, effect.player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            let cardsToDiscard = [];
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                if (em.card.energyType === card_types_1.EnergyType.BASIC) {
                    energyCount += em.provides.length;
                    cardsToDiscard.push(em.card);
                }
            });
            effect.damage = energyCount * 80;
            const discardEnergyEffect = new attack_effects_1.DiscardCardsEffect(effect, cardsToDiscard);
            discardEnergyEffect.target = player.active;
            store.reduceEffect(state, discardEnergyEffect);
            return state;
        }
        return state;
    }
}
exports.DragoniumZDragonClaw = DragoniumZDragonClaw;
