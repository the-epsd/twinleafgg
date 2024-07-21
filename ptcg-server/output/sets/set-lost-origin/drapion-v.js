"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrapionV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class DrapionV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Wild Style',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon\'s attacks cost C less for each of your opponent\'s Single Strike, Rapid Strike, and Fusion Strike Pokémon in play.'
            }];
        this.attacks = [
            {
                name: 'Dynamic Tail',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 190,
                text: 'This attack also does 60 damage to 1 of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '118';
        this.name = 'Drapion V';
        this.fullName = 'Drapion V LOR';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Count V, VSTAR, and VMAX Pokémon in play for the opponent
            const countSpecialPokemon = (player) => {
                const specialTags = [card_types_2.CardTag.FUSION_STRIKE, card_types_2.CardTag.RAPID_STRIKE, card_types_2.CardTag.SINGLE_STRIKE];
                let count = 0;
                // Check active Pokémon
                const activePokemon = player.active.getPokemonCard();
                if (activePokemon && specialTags.some(tag => activePokemon.tags.includes(tag))) {
                    count++;
                }
                // Check bench Pokémon
                player.bench.forEach(slot => {
                    const benchPokemon = slot.getPokemonCard();
                    if (benchPokemon && specialTags.some(tag => benchPokemon.tags.includes(tag))) {
                        count++;
                    }
                });
                return count;
            };
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                console.log(effect.cost);
                return state;
            }
            const specialPokemonCount = countSpecialPokemon(opponent);
            // Determine Colorless energy reduction based on special Pokémon count
            const colorlessToRemove = Math.min(specialPokemonCount, 4);
            // Remove Colorless energy from attack cost
            for (let i = 0; i < colorlessToRemove; i++) {
                const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                if (index !== -1) {
                    effect.cost.splice(index, 1);
                }
            }
            console.log(effect.cost);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.damage += 60;
                    }
                });
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 60);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.DrapionV = DrapionV;
