"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineBlindside = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TechnicalMachineBlindside extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '176';
        this.name = 'Technical Machine: Blindside';
        this.fullName = 'Technical Machine: Blindside PAR';
        this.attacks = [{
                name: 'Blindside',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 100 damage to 1 of your opponent\'s Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const pokemonCard = effect.player.active.getPokemonCard();
            if (pokemonCard && 'getColorlessReduction' in pokemonCard) {
                const reduction = pokemonCard.getColorlessReduction(state);
                for (let i = 0; i < reduction && effect.cost.includes(card_types_1.CardType.COLORLESS); i++) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                }
            }
        }
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
                if (cardList.cards.includes(this)) {
                    cardList.moveCardTo(this, player.discard);
                    cardList.tool = undefined;
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            let hasDamagedPokemon = false;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    hasDamagedPokemon = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasDamagedPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched && opponent.active.damage > 0) {
                effect.damage = 100;
            }
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: false, blocked: blocked }), target => {
                if (!target || target.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                damageEffect.target = target[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.TechnicalMachineBlindside = TechnicalMachineBlindside;
