"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagingBolt = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RagingBolt extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.ANCIENT];
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 130;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunderburst Storm',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon for each Energy attached to this Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Dragon Headbutt',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }
        ];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '111';
        this.name = 'Raging Bolt';
        this.fullName = 'Raging Bolt SCR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                const providedEnergy = checkProvidedEnergyEffect.energyMap.reduce((acc, curr) => acc + curr.provides.length, 0);
                const damage = providedEnergy * 30;
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, damage);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.RagingBolt = RagingBolt;
