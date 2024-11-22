"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duskull = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useKingsOrder(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    const max = Math.min(slots.length, 3);
    const hasDuskullInDiscard = player.hand.cards.some(c => {
        return c instanceof pokemon_card_1.PokemonCard && c.name === 'Duskull';
    });
    if (!hasDuskullInDiscard) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, name: 'Duskull' }, { min: 1, max, allowCancel: false }), selected => {
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
class Duskull extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Come and Get You',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put up to 3 Duskull from your discard pile onto your Bench.'
            },
            {
                name: 'Mumble',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: ''
            },
        ];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Duskull';
        this.fullName = 'Duskull SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useKingsOrder(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Duskull = Duskull;
