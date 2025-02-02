"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whimsicott = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
function* useProwl(next, store, state, self, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        const stub = new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: game_1.PowerType.ABILITY,
            text: ''
        }, self);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return state;
    }
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: true }), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
        next();
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Whimsicott extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = Y;
        this.hp = 80;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.evolvesFrom = 'Cottonee';
        this.powers = [{
                name: 'Prowl',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
                    'Pokemon, you may search your deck for any card and put it into your ' +
                    'hand. Shuffle your deck afterward.'
            }];
        this.attacks = [{
                name: 'Gust',
                cost: [C],
                damage: 40,
                text: ''
            }];
        this.set = 'UNM';
        this.name = 'Whimsicott';
        this.fullName = 'Whimsicott UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '144';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Check to see if anything is blocking our Ability
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
            const generator = useProwl(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Whimsicott = Whimsicott;
