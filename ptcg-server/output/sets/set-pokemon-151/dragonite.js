"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Jet Cruise',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Your Pokémon in play have no Retreat Cost.'
            }];
        this.attacks = [{
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING],
                damage: 180,
                text: 'Discard the top 2 cards of your deck.'
            }];
        this.set = 'MEW';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '149';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Discard 2 cards from your deck 
            player.deck.moveTo(player.discard, 2);
            return state;
        }
        if (effect instanceof check_effects_1.CheckRetreatCostEffect) {
            const player = effect.player;
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            const owner = state_utils_1.StateUtils.findOwner(state, cardList);
            if (player === owner) {
                let isDragoniteInPlay = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        isDragoniteInPlay = true;
                    }
                });
                if (!isDragoniteInPlay) {
                    return state;
                }
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                effect.cost = [];
            }
            return state;
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
