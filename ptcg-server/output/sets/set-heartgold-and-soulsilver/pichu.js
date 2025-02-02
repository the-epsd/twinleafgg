"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* usePlayground(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
    specialCondition.target = player.active;
    store.reduceEffect(state, specialCondition);
    // Player
    let slots = player.bench.filter(b => b.cards.length === 0);
    let max = slots.length;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    // Opponent
    slots = opponent.bench.filter(b => b.cards.length === 0);
    max = slots.length;
    yield store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, opponent.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 0, max, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        opponent.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
    // Shuffle decks
    store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
    store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
    });
    return state;
}
class Pichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 30;
        this.retreat = [];
        this.powers = [{
                name: 'Sweet Sleeping Face',
                powerType: game_1.PowerType.POKEBODY,
                text: 'As long as Pichu is Asleep, prevent all damage done to Cleffa ' +
                    'by attacks.'
            }];
        this.attacks = [
            {
                name: 'Playground',
                cost: [],
                damage: 0,
                text: 'Each player may search his or her deck for as many Basic ' +
                    'Pokemon as he or she likes, put them onto his or her Bench, and ' +
                    'shuffle his or her deck afterward. (You put your Pokemon on the ' +
                    'Bench first.) Pichu is now Asleep.'
            }
        ];
        this.set = 'HS';
        this.name = 'Pichu';
        this.fullName = 'Pichu HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
    }
    reduceEffect(store, state, effect) {
        // Playground
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = usePlayground(() => generator.next(), store, state, effect);
            return generator.next().value;
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
exports.Pichu = Pichu;
