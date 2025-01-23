"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HitmonleeMEW = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_2 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class HitmonleeMEW extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Twister Kick',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Switch this Pokémon with 1 of your Benched Pokémon.'
            },
            {
                name: 'Low Kick',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING],
                damage: 100,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.setNumber = '106';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Hitmonlee';
        this.fullName = 'Hitmonlee MEW';
    }
    reduceEffect(store, state, effect) {
        // Twister Kick
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_2.PlayerType.TOP_PLAYER, (cardList) => {
                let kickDamage = 10;
                if (cardList === opponent.active) {
                    const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, kickDamage);
                    store.reduceEffect(state, applyWeakness);
                    kickDamage = applyWeakness.damage;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, kickDamage);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_2.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                player.switchPokemon(cardList);
            });
        }
        return state;
    }
}
exports.HitmonleeMEW = HitmonleeMEW;
