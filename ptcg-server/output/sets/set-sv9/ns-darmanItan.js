"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsDarmanitan = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class NsDarmanitan extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.NS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'N\'s Darumaka';
        this.cardType = R;
        this.weakness = [{ type: W }];
        this.hp = 140;
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Backdraft',
                cost: [C, C],
                damage: 30,
                text: 'This attack does 30 damage for each Basic Energy card in your opponent’s discard pile.'
            },
            {
                name: 'Darman-i-cannon',
                cost: [R, R, C],
                damage: 90,
                text: 'Discard all Energy from this Pokémon. This attack also does 90 damage to 1 of your opponent’s Benched Pokémon. (Don’t apply Weakness and Resistance for Benched Pokémon.)'
            },
        ];
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.set = 'SV9';
        this.setNumber = '16';
        this.name = 'N\'s Darmanitan';
        this.fullName = 'N\'s Darmanitan SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let energyCount = 0;
            opponent.discard.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    energyCount += 1;
                }
            });
            effect.damage = energyCount * 30;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // discard time
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = [];
            checkProvidedEnergy.energyMap.forEach(em => {
                cards.push(em.card);
            });
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            // bench snipe gaming
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 90);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.NsDarmanitan = NsDarmanitan;
