"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnezoneex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Magnezoneex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Magneton';
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Energy Crush',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 50,
                damageCalculation: 'x',
                text: 'This attack does 50 damage for each Energy attached to all of your opponent\'s Pokémon.'
            },
            {
                name: 'Pulse Launcher',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 220,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '65';
        this.name = 'Magnezone ex';
        this.fullName = 'Magnezone ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let energies = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage = energies * 50;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
            dealDamage.target = player.active;
            return store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Magnezoneex = Magnezoneex;
