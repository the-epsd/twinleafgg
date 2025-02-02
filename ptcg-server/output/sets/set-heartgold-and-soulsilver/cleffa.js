"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cleffa = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Cleffa extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 30;
        this.retreat = [];
        this.powers = [{
                name: 'Sweet Sleeping Face',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Cleffa is Asleep, prevent all damage done to Cleffa ' +
                    'by attacks.'
            }];
        this.attacks = [
            {
                name: 'Eeeeeeek',
                cost: [],
                damage: 0,
                text: 'Shuffle your hand into your deck, then draw 6 cards. Cleffa is ' +
                    'now Asleep.'
            }
        ];
        this.set = 'HS';
        this.name = 'Cleffa';
        this.fullName = 'Cleffa HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '17';
    }
    reduceEffect(store, state, effect) {
        // Eeeeeeek
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            player.hand.moveTo(player.deck);
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            specialCondition.target = player.active;
            store.reduceEffect(state, specialCondition);
            return store.prompt(state, [
                new game_1.ShuffleDeckPrompt(player.id)
            ], deckOrder => {
                player.deck.applyOrder(deckOrder);
                player.deck.moveTo(player.hand, 6);
            });
        }
        // Sweet Sleeping Face
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            if (effect.target.cards.includes(this)) {
                const pokemonCard = effect.target.getPokemonCard();
                const isAsleep = effect.target.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP);
                if (pokemonCard === this && isAsleep) {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const stub = new game_effects_1.PowerEffect(effect.player, {
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
        }
        return state;
    }
}
exports.Cleffa = Cleffa;
