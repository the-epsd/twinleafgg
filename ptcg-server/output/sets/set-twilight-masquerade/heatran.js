"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heatran = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Heatran extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), the Attacking Pokémon is now Burned.',
                useWhenInPlay: false,
                name: 'Incandescent Body'
            }];
        this.attacks = [{
                name: 'Steel Burst',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                damageCalculation: 'x',
                text: 'Discard all [M] Energy from this Pokémon. This attack does 50 damage for each card you discarded in this way.'
            }];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Heatran';
        this.fullName = 'Heatran TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            let totalDiscarded = 0;
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            totalDiscarded += discardEnergy.cards.length;
            store.reduceEffect(state, discardEnergy);
            effect.damage += (totalDiscarded - 1) * 50;
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.target.cards.includes(this)) {
            const player = effect.player;
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
                return state;
            }
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
            if (state.phase === game_1.GamePhase.ATTACK) {
                effect.source.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            }
        }
        return state;
    }
}
exports.Heatran = Heatran;
