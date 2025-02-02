"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zarude = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Zarude extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Drag Off',
                cost: [card_types_1.CardType.GRASS],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.This attack does 20 damage to the new Active Pokémon.'
            },
            {
                name: 'Triple Whip',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 70,
                damageCalculation: 'x',
                text: ' Flip 3 coins. This attack does 70 damage for each heads. '
            }];
        this.set = 'CRZ';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Zarude CRZ';
        this.name = 'Zarude';
        this.setNumber = '16';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                damageEffect.target = opponent.active;
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 70 * heads;
            });
            return state;
        }
        return state;
    }
}
exports.Zarude = Zarude;
