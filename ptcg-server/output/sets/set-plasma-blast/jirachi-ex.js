"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JirachiEx = void 0;
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useStellarGuidance(next, store, state, self, effect) {
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
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 1, max: 1, allowCancel: true }), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
        next();
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class JirachiEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Stellar Guidance',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand onto your Bench, ' +
                    'you may search your deck for a Supporter card, reveal it, and put it ' +
                    'into your hand. Shuffle your deck afterward.'
            }];
        this.attacks = [
            {
                name: 'Hypnostrike',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Both this Pokemon and the Defending Pokemon are now Asleep.'
            }
        ];
        this.set = 'PLB';
        this.name = 'Jirachi EX';
        this.fullName = 'Jirachi EX PLB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useStellarGuidance(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const asleepEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            asleepEffect.target = player.active;
            store.reduceEffect(state, asleepEffect);
            const asleepEffect2 = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, asleepEffect2);
        }
        return state;
    }
}
exports.JirachiEx = JirachiEx;
