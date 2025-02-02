"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roserade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_message_1 = require("../../game/game-message");
function* useLeParfum(next, store, state, self, effect) {
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
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: true }), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
        next();
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Roserade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Roselia';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Le Parfum',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand to evolve 1 of your ' +
                    'Pokemon, you may search your deck for any card and put it into your ' +
                    'hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Squeeze',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Flip a coin. If heads, this attack does 20 more damage and ' +
                    'the Defending Pokemon is now Paralyzed.'
            }
        ];
        this.set = 'DRX';
        this.name = 'Roserade';
        this.fullName = 'Roserade DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useLeParfum(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const addSpecialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.PARALYZED]);
                    effect.damage += 20;
                    store.reduceEffect(state, addSpecialCondition);
                }
            });
        }
        return state;
    }
}
exports.Roserade = Roserade;
