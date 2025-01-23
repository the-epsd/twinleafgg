"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dartrix = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
// CIN Dartrix 57 (https://limitlesstcg.com/cards/CIN/57)
class Dartrix extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rowlet';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Sharp Blade Quill', cost: [card_types_1.CardType.COLORLESS], damage: 0, text: 'This attack does 20 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
            { name: 'Leaf Blade', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], damage: 50, text: 'Flip a coin. If heads, this attack does 20 more damage.' },
        ];
        this.set = 'SUM';
        this.setNumber = '10';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Dartrix';
        this.fullName = 'Dartrix SUM';
    }
    reduceEffect(store, state, effect) {
        // Sharp Blade Quill
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Leaf Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_2.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results === true) {
                    effect.damage += 20;
                }
            });
        }
        return state;
    }
}
exports.Dartrix = Dartrix;
