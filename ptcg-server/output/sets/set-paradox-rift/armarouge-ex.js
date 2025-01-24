"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmarougeEX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class ArmarougeEX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Charcadet';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Crimson Armor',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has full HP, it takes 80 less damage from attacks from your opponent\'s Pokémon (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Scorching Bazooka',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'This attack does 40 more damage for each [R] Energy attached to this Pokémon.'
            }
        ];
        this.set = 'PAR';
        this.setNumber = '27';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'D';
        this.name = 'Armarouge ex';
        this.fullName = 'Armarouge ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Crimson Armor
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // checking damage (it having no damage should confirm that this has full hp, no matter what its hp is set to)
            if (effect.target.damage === 0) {
                effect.damage -= 80;
            }
        }
        // Scorching Bazooka
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.FIRE || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage += energyCount * 40;
        }
        return state;
    }
}
exports.ArmarougeEX = ArmarougeEX;
