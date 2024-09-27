"use strict";
// citing empoleon to help make this (https://github.com/keeshii/ryuu-play/blob/master/ptcg-server/src/sets/set-black-and-white/empoleon.ts)
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hydreigon_ex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Hydreigon_ex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Zweilous';
        this.cardType = game_1.CardType.DARK;
        this.hp = 330;
        this.weakness = [{ type: game_1.CardType.GRASS }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Crash Heads',
                cost: [game_1.CardType.DARK, game_1.CardType.COLORLESS],
                damage: 200,
                text: 'Discard the top 3 cards from your opponent’s deck.'
            },
            {
                name: 'Obsidian',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.DARK, game_1.CardType.METAL, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'This attack also does 130 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV8';
        this.setNumber = '72';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hydreigon-ex';
        this.fullName = 'Hydreigon-ex SV8';
    }
    reduceEffect(store, state, effect) {
        // Crash Heads
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 3);
            return state;
        }
        // Obsidian
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            const count = Math.min(2, benched);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: count, max: count, allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 130);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        return state;
    }
}
exports.Hydreigon_ex = Hydreigon_ex;
