"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salandit = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const shuffle_prompt_1 = require("../../game/store/prompts/shuffle-prompt");
const game_message_1 = require("../../game/game-message");
function* useCallforFamily(next, store, state, effect) {
    const player = effect.player;
    const slot = player.bench.find(b => b.cards.length === 0);
    if (slot === undefined) {
        return state;
    }
    yield store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC }, { min: 1, max: 1, allowCancel: false }), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, slot);
        slot.pokemonPlayedTurn = state.turn;
        next();
    });
    return store.prompt(state, new shuffle_prompt_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Salandit extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Call for Family',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for a Basic Pokemon and put it onto your Bench. Then, shuffle your deck.'
            },
            {
                name: 'Dig Claws',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            },
        ];
        this.set = 'DRM';
        this.setNumber = '13';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Salandit';
        this.fullName = 'Salandit DRM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCallforFamily(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Salandit = Salandit;
