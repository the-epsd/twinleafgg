"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useMixedCall(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    let cards = [];
    // Count pokemon and supporters separately
    let pokemon = 0;
    let supporters = 0;
    const blocked = [];
    player.deck.cards.forEach((c, index) => {
        if (c instanceof pokemon_card_1.PokemonCard) {
            pokemon++;
        }
        else if (c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER) {
            supporters++;
        }
        else {
            blocked.push(index);
        }
    });
    const maxPokemons = Math.min(pokemon, 1);
    const maxSupporters = Math.min(supporters, 1);
    const count = maxPokemons + maxSupporters;
    // Pass max counts to prompt options
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_ONE_POKEMON_AND_ONE_SUPPORTER_TO_HAND, player.deck, {}, { min: 0, max: count, allowCancel: false, blocked, maxPokemons, maxSupporters }), selected => {
        cards = selected || [];
        next();
    });
    player.deck.moveCardsTo(cards, player.hand);
    cards.forEach((card, index) => {
        store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
    });
    if (cards.length > 0) {
        yield store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => next());
    }
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Oricorio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.tags = [card_types_1.CardTag.FUSION_STRIKE];
        this.attacks = [{
                name: 'Mixed Call',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Pokémon and a Supporter card, reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Razor Wing',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.regulationMark = 'E';
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio SWSH';
        this.setNumber = '210';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useMixedCall(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Oricorio = Oricorio;
