"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snorlax = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Snorlax extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Block',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon can\'t retreat.'
            }];
        this.attacks = [
            {
                name: 'Collapse',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'This Pokemon is now Asleep.'
            }
        ];
        this.regulationMark = 'F';
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Snorlax';
        this.fullName = 'Snorlax PGO';
    }
    reduceEffect(store, state, effect) {
        // Block retreat for opponent's poisoned Pokemon.
        if (effect instanceof game_effects_1.RetreatEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isSnorlaxInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (opponent.active.cards[0] == this) {
                    isSnorlaxInPlay = true;
                }
            });
            if (isSnorlaxInPlay) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
                specialConditionEffect.target = effect.player.active;
                store.reduceEffect(state, specialConditionEffect);
                return state;
            }
        }
        return state;
    }
}
exports.Snorlax = Snorlax;
