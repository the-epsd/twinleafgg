"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DarkraiEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class DarkraiEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dark Cloak',
                powerType: game_1.PowerType.ABILITY,
                text: 'Each of your Pokemon that has any [D] Energy attached to it ' +
                    'has no Retreat Cost.'
            }];
        this.attacks = [
            {
                name: 'Night Spear',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Does 30 damage to 1 of your opponent\'s Benched Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.set = 'DEX';
        this.name = 'Darkrai EX';
        this.fullName = 'Darkrai EX DEX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            let hasDarkraiInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasDarkraiInPlay = true;
                }
            });
            if (!hasDarkraiInPlay) {
                return state;
            }
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyMap = checkProvidedEnergyEffect.energyMap;
            const hasDarknessEnergy = game_1.StateUtils.checkEnoughEnergy(energyMap, [card_types_1.CardType.DARK]);
            if (hasDarknessEnergy) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.cost = [];
            }
            return state;
        }
        return state;
    }
}
exports.DarkraiEx = DarkraiEx;
