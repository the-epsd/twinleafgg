"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bombirdierex = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useCallForFamily(next, store, state, effect) {
    const player = effect.player;
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (slots.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC }, { min: 0, max: 3, allowCancel: false }), selected => {
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
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Bombirdierex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = game_1.CardType.COLORLESS;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Fast Carrier',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'If you go first, you can use this attack during your first turn. Search your deck for up to 3 Basic Pokémon and put them onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Shadowy Wind',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 130,
                text: 'You may put this Pokémon and all attached cards into your hand.'
            }
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'G';
        this.setNumber = '156';
        this.name = 'Bombirdier ex';
        this.fullName = 'Bombirdier ex PAR';
    }
    reduceEffect(store, state, effect) {
        // Implement ability
        const player = state.players[state.activePlayer];
        if (state.turn == 1 && player.active.cards[0] == this) {
            player.canAttackFirstTurn = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallForFamily(() => generator.next(), store, state, effect);
            if (player.canAttackFirstTurn) {
                return generator.next().value;
            }
        }
        // Implement attack
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.active.moveTo(player.deck);
                    player.active.clearEffects();
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                }
            });
        }
        return state;
    }
}
exports.Bombirdierex = Bombirdierex;
