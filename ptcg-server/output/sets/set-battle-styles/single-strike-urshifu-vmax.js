"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleStrikeUrshifuVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SingleStrikeUrshifuVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Single Strike Urshifu V';
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Beatdown',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            },
            {
                name: 'G-Max One Blow',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 270,
                shredAttack: true,
                text: 'Discard all Energy from this Pokémon. This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '86';
        this.name = 'Single Strike Urshifu VMAX';
        this.fullName = 'Single Strike Urshifu VMAX BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 270);
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
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.SingleStrikeUrshifuVMAX = SingleStrikeUrshifuVMAX;
