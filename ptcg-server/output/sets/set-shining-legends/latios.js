"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Latios = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// SLG Latios 41 (https://limitlesstcg.com/cards/SLG/41)
class Latios extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Break Through',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Lagoon Flight',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS,],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'SLG';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Latios';
        this.fullName = 'Latios SLG';
    }
    reduceEffect(store, state, effect) {
        // Break Through
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        return state;
    }
}
exports.Latios = Latios;
