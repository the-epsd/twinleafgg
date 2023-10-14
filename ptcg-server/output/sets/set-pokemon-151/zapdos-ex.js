"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zapdosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zapdosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Voltaic Float',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If this Pokémon has any Lightning Energy attached, it has no ' +
                    'Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Multishot Lightning',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 120,
                text: 'This attack also does 90 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = '151';
        this.set2 = '151';
        this.setNumber = '145';
        this.name = 'Zapdos ex';
        this.fullName = 'Zapdos ex MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            const pokemonCard = player.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            // Check attached energy 
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            // Look for Lightning energy
            const hasLightning = checkProvidedEnergy.energyMap.some(e => {
                if (e.provides.includes(card_types_1.CardType.LIGHTNING)) {
                    return true;
                }
                if (hasLightning) {
                    // Set retreat cost to empty if Lightning attached
                    effect.cost = [0];
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const source = opponent.bench;
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const damagedBenched = source.filter(b => b.damage > 0);
            if (damagedBenched) {
                // Opponent has damaged benched Pokemon
                state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { max: 1, allowCancel: false }), targets => {
                    if (!targets || targets.length === 0) {
                        return;
                    }
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 90);
                    damageEffect.target = targets[0];
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Zapdosex = Zapdosex;
