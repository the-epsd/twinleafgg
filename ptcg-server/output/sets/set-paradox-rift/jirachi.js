"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jirachi = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jirachi extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Stellar Veil',
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks from your opponent\'s Basic Pokémon can\'t put damage counters on your Benched Pokémon.'
            }
        ];
        this.attacks = [{
                name: 'Charge Energy',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '126';
        this.name = 'Jirachi';
        this.fullName = 'Jirachi PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.PutCountersEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            const targetPlayer = game_1.StateUtils.findOwner(state, effect.target);
            let isJirachiInPlay = false;
            targetPlayer.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isJirachiInPlay = true;
                }
            });
            if (!isJirachiInPlay) {
                return state;
            }
            const sourceCard = effect.source.getPokemonCard();
            if (sourceCard && sourceCard.stage === card_types_1.Stage.BASIC) {
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
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Jirachi = Jirachi;
