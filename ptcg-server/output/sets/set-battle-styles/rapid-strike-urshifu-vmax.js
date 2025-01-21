"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RapidStrikeUrshifuVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RapidStrikeUrshifuVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.RAPID_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Rapid Strike Urshifu V';
        this.cardType = F;
        this.hp = 330;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Gale Thrust',
                cost: [F],
                damage: 30,
                text: 'If this Pokémon moved from your Bench to the Active Spot this turn, this attack does 120 more damage.'
            },
            {
                name: 'G-Max Rapid Flow',
                cost: [F, F, C],
                damage: 0,
                text: 'Discard all Energy from this Pokémon. This attack does 120 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '88';
        this.name = 'Rapid Strike Urshifu VMAX';
        this.fullName = 'Rapid Strike Urshifu VMAX BST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            console.log('movedToActiveThisTurn = false');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.movedToActiveThisTurn) {
                effect.damage += 120;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
            const max = Math.min(2);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: max, max, allowCancel: false }), selected => {
                const targets = selected || [];
                if (targets.includes(opponent.active)) {
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 120);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                }
            });
        }
        return state;
    }
}
exports.RapidStrikeUrshifuVMAX = RapidStrikeUrshifuVMAX;
