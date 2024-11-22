"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pichu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useBabyEvolution(next, store, state, self, effect) {
    const player = effect.player;
    const cardList = game_1.StateUtils.findCardList(state, self);
    if (!(cardList instanceof game_1.PokemonCardList)) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const hasPikachu = player.hand.cards.some(c => c.name === 'Pikachu');
    if (!hasPikachu) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    let cards = [];
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, player.hand, { superType: card_types_1.SuperType.POKEMON, name: 'Pikachu' }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        if (cards.length > 0) {
            const pokemonCard = cards[0];
            const evolveEffect = new game_effects_1.EvolveEffect(player, cardList, pokemonCard);
            store.reduceEffect(state, evolveEffect);
            cardList.damage = 0;
        }
    });
}
function* useFindAFriend(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    if (player.deck.cards.length === 0) {
        return state;
    }
    let coinResult = false;
    yield store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
        coinResult = result;
        next();
    });
    if (coinResult === false) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON }, { allowCancel: true, min: 1, max: 1 }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    player.deck.moveCardsTo(cards, player.hand);
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Pichu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: 10 }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Baby Evolution',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn (before your attack), you may put Pikachu ' +
                    'from your hand onto Pichu (this counts as evolving Pichu) and remove ' +
                    'all damage counters from Pichu.'
            }];
        this.attacks = [
            {
                name: 'Find a Friend',
                cost: [],
                damage: 0,
                text: 'Flip a coin. If heads, search your deck for a Pokemon, ' +
                    'show it to your opponent, and put it into your hand. ' +
                    'Shuffle your deck afterward.'
            }
        ];
        this.set = 'OP9';
        this.name = 'Pichu';
        this.fullName = 'Pichu OP9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useBabyEvolution(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useFindAFriend(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Pichu = Pichu;
