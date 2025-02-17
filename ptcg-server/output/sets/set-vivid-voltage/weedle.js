"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weedle = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useBugHunch(next, store, state, effect) {
    const player = effect.player;
    const opponent = effect.opponent;
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.POKEMON, stage: game_1.Stage.BASIC, cardType: game_1.CardType.GRASS }, { min: 0, max: 2, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Weedle extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 40;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Bug Hunch',
                cost: [G],
                damage: 0,
                text: 'Search your deck for up to 2 [G] Pokémon, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
        ];
        this.regulationMark = 'D';
        this.set = 'VIV';
        this.setNumber = '1';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Weedle';
        this.fullName = 'Weedle VIV';
    }
    reduceEffect(store, state, effect) {
        // Bug Hunch
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useBugHunch(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Weedle = Weedle;
