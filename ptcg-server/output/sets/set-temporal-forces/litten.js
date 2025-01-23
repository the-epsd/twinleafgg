"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litten = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Litten extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Fake Out', cost: [card_types_1.CardType.FIRE], damage: 10, text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed. ' }
        ];
        this.set = 'TEF';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Litten';
        this.fullName = 'Litten TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    return store.reduceEffect(state, specialCondition);
                }
            });
        }
        return state;
    }
}
exports.Litten = Litten;
