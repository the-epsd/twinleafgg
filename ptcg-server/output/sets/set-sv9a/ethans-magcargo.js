"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansMagcargo = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansMagcargo extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ethan\'s Slugma';
        this.tags = [game_1.CardTag.ETHANS];
        this.cardType = R;
        this.hp = 130;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.powers = [{
                name: 'Melt and Flow',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has no Energy attached, it has no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Lava Burst',
                cost: [R, R, R],
                damage: 70,
                damageCalculation: 'x',
                text: 'Discard up to 5 [R] Energy from this Pokémon. This attack does 70 damage for each card you discarded in this way.'
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Ethan\'s Magcargo';
        this.fullName = 'Ethan\'s Magcargo SV9a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
            const player = effect.player;
            if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                state = store.reduceEffect(state, checkProvidedEnergy);
                if (checkProvidedEnergy.energyMap.length === 0) {
                    effect.cost = [];
                }
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], // Card source is target Pokemon
            { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 0, max: 5, allowCancel: false }), energy => {
                const cards = (energy || []).map(e => e.card);
                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discardEnergy.target = player.active;
                state = store.reduceEffect(state, discardEnergy);
                effect.damage = 70 * cards.length;
                return state;
            });
        }
        return state;
    }
}
exports.EthansMagcargo = EthansMagcargo;
