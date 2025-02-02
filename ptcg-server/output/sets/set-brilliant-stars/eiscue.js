"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eiscue = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Eiscue extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.WATER;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Block Slider',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER],
                damage: 0,
                text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon for each Fusion Strike Energy attached to all of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Icicle Missile',
                cost: [game_1.CardType.WATER, game_1.CardType.WATER, game_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            }
        ];
        this.regulationMark = 'F';
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Eiscue';
        this.fullName = 'Eiscue BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return em.card.tags.includes(game_1.CardTag.FUSION_STRIKE);
                }).length;
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, energyCount * 40);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Eiscue = Eiscue;
