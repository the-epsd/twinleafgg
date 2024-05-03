"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkingWakeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class WalkingWakeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Azure Wave',
                powerType: game_1.PowerType.ABILITY,
                text: 'Damage from attacks used by this Pokémon isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Cathartic Roar',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t attack.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
        this.name = 'Walking Wake ex';
        this.fullName = 'Walking Wake ex TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.DealDamageEffect) {
            const player = effect.player;
            const targetCard = player.active.getPokemonCard();
            if (targetCard && targetCard.name == 'Walking Wake ex') {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (effect instanceof game_effects_1.AttackEffect && effect.target === opponent.active) {
                    const damage = this.attacks[0].damage;
                    const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, damage);
                    store.reduceEffect(state, applyWeakness);
                    const newDamage = applyWeakness.damage;
                    effect.damage = 0;
                    if (newDamage > 0) {
                        opponent.active.damage += newDamage;
                        const afterDamage = new attack_effects_1.AfterDamageEffect(effect, newDamage);
                        state = store.reduceEffect(state, afterDamage);
                    }
                }
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const player = effect.player;
                const opponent = game_1.StateUtils.getOpponent(state, player);
                if (opponent.active.specialConditions.length > 0) {
                    const attackEffect = effect;
                    attackEffect.damage += 120;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.WalkingWakeex = WalkingWakeex;
