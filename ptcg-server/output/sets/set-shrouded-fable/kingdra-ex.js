"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kingdraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useKingsOrder(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 3);
    // const hasWaterPokemonInDiscard = player.discard.cards.some(c => {
    //   return c instanceof PokemonCard && c.cardType === CardType.WATER;
    // });
    // if (!hasWaterPokemonInDiscard) {
    //   throw new GameError(GameMessage.CANNOT_USE_ATTACK);
    // }
    const hasWaterPokemonInDiscard = player.discard.cards.some(c => {
        const discardPokemon = player.discard.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
        const waterDiscardPokemon = discardPokemon.filter(card => card.cardType === card_types_1.CardType.WATER);
        return waterDiscardPokemon.length > 0;
    });
    if (!hasWaterPokemonInDiscard || slots.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.WATER }, { min: 1, max, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > slots.length) {
        cards.length = slots.length;
    }
    cards.forEach((card, index) => {
        player.discard.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
    });
}
class Kingdraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Seadra';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'King\'s Order',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put up to 3 [W] Pokémon from your discard pile onto your Bench.'
            },
            {
                name: 'Hydro Pump',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each [W] Energy attached to this Pokémon.'
            },
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Kingdra ex';
        this.fullName = 'Kingdra ex SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useKingsOrder(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => cardType === card_types_1.CardType.WATER || cardType === card_types_1.CardType.ANY).length;
            });
            effect.damage += energyCount * 50;
        }
        return state;
    }
}
exports.Kingdraex = Kingdraex;
