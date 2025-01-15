"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veluza = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Veluza extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Food Prep',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
            }
        ];
        this.attacks = [
            {
                name: 'Sonic Edge',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'SCR';
        this.name = 'Veluza';
        this.fullName = 'Veluza SCR';
        this.setNumber = '45';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Food Prep
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            let kofuCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.name === 'Kofu') {
                    kofuCount += 1;
                }
            });
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            effect.cost.splice(index, kofuCount);
            return state;
        }
        // Sonic Edge
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 110);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.Veluza = Veluza;
