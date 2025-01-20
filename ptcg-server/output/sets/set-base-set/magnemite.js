"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magnemite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const coin_flip_prompt_1 = require("../../game/store/prompts/coin-flip-prompt");
class Magnemite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Magnemite BS';
        this.name = 'Magnemite';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.stage = card_types_1.Stage.BASIC;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '53';
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Thunder Wave',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
            },
            {
                name: 'Selfdestruct',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Does 10 damage to each Pokémon on each player’s Bench. (Don’t apply Weakness and Resistance for Benched Pokémon.) Magnemite does 40 damage to itself.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new coin_flip_prompt_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialCondition);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Damage opponent's bench
            opponent.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage player's bench
            player.bench.forEach(benchPokemon => {
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 10);
                dealDamage.target = benchPokemon;
                store.reduceEffect(state, dealDamage);
            });
            // Damage self
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 40);
            dealDamage.target = player.active;
            store.reduceEffect(state, dealDamage);
        }
        return state;
    }
}
exports.Magnemite = Magnemite;
