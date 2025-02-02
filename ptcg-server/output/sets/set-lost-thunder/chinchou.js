"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chinchou = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Chinchou extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Thunder Wave',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
            }, {
                name: 'Lightning Ball',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }];
        this.set = 'LOT';
        this.name = 'Chinchou';
        this.fullName = 'Chinchou LOT';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    store.reduceEffect(state, specialConditionEffect);
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Chinchou = Chinchou;
