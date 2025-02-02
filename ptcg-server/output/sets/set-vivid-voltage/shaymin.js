"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminVIV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ShayminVIV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Leech Seed',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Heal 20 damage from this Pokémon.'
            },
            {
                name: 'Flower Bearing',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent shuffles their Active Pokémon and all attached cards and puts them on the bottom of their deck.'
            }
        ];
        this.set = 'VIV';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'D';
        this.name = 'Shaymin';
        this.fullName = 'Shaymin VIV';
    }
    reduceEffect(store, state, effect) {
        // Leech Seed
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const healingTime = new attack_effects_1.HealTargetEffect(effect, 20);
            healingTime.target = player.active;
            store.reduceEffect(state, healingTime);
        }
        // Flower Bearing
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    opponent.active.moveTo(opponent.deck);
                    opponent.active.clearEffects();
                }
            });
        }
        return state;
    }
}
exports.ShayminVIV = ShayminVIV;
