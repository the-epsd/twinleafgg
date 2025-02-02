"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../../game");
const choose_cards_prompt_resolver_1 = require("./choose-cards-prompt-resolver");
const simple_bot_definitions_1 = require("../simple-bot-definitions");
class TestCard extends game_1.PokemonCard {
    constructor(name) {
        super();
        this.name = 'energy';
        this.fullName = 'energy';
        this.set = 'test';
        this.name = name;
    }
}
describe('ChooseCardsPromptResolver', () => {
    let resolver;
    let prompt;
    let state;
    let player;
    let opponent;
    beforeEach(() => {
        const simpleBotOptions = {
            tactics: simple_bot_definitions_1.allSimpleTactics,
            promptResolvers: simple_bot_definitions_1.allPromptResolvers,
            scores: simple_bot_definitions_1.defaultStateScores,
            arbiter: simple_bot_definitions_1.defaultArbiterOptions
        };
        resolver = new choose_cards_prompt_resolver_1.ChooseCardsPromptResolver(simpleBotOptions);
        player = new game_1.Player();
        player.id = 1;
        opponent = new game_1.Player();
        opponent.id = 2;
        state = new game_1.State();
        state.players = [player, opponent];
        prompt = new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {});
    });
    it('Should return undefined when other prompt type', () => {
        // given
        const other = {};
        // when
        const action = resolver.resolvePrompt(state, player, other);
        // then
        expect(action).toBeUndefined();
    });
    it('Should choose single card', () => {
        // given
        const card = new TestCard('card');
        player.deck.cards.push(card);
        prompt.options.max = player.deck.cards.length;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([card]);
    });
    it('Should not choose blocked cards', () => {
        // given
        const cards = [new TestCard('a'), new TestCard('b'), new TestCard('c')];
        player.deck.cards = cards;
        prompt.options.max = cards.length;
        prompt.options.blocked = [0, 2];
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result).toEqual([new TestCard('b')]);
    });
    it('Should choose cards with different types', () => {
        // given
        const w = new TestCard('w');
        w.cardType = game_1.CardType.WATER;
        const r = new TestCard('r');
        r.cardType = game_1.CardType.FIRE;
        const p = new TestCard('p');
        p.cardType = game_1.CardType.PSYCHIC;
        const p2 = new TestCard('p2');
        p2.cardType = game_1.CardType.PSYCHIC;
        const cards = [w, p, p2, r];
        player.deck.cards = cards;
        prompt.options.max = cards.length;
        prompt.options.differentTypes = true;
        // when
        const action = resolver.resolvePrompt(state, player, prompt);
        const result = action.result;
        // then
        expect(action instanceof game_1.ResolvePromptAction).toBeTruthy();
        expect(result.length).toEqual(3);
        expect(result.includes(w)).toBeTruthy();
        expect(result.includes(r)).toBeTruthy();
    });
});
