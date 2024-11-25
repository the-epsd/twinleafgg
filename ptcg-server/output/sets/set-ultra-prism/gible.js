"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gible = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useAscension(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_1, evolvesFrom: 'Gible' }, { min: 1, max: 1, allowCancel: true }), selected => {
        cards = selected || [];
        next();
    });
    if (cards.length > 0) {
        // Evolve Pokemon
        player.deck.moveCardsTo(cards, player.active);
        player.active.clearEffects();
        player.active.pokemonPlayedTurn = state.turn;
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Gible extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Ascension',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'Search your deck for a card that evolves from this Pokémon and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
            }
        ];
        this.set = 'UPR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Gible';
        this.fullName = 'Gible UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useAscension(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Gible = Gible;
