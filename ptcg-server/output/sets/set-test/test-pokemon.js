"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestPokemon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TestPokemon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 100;
        this.weakness = [{ type: C }];
        this.retreat = [];
        this.powers = [
            {
                name: 'Have Your Cake',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Add as many cards as you want from your deck to your hand.'
            },
            {
                name: 'Extremely Cursed Blast',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, both players Active Pokemon are Knocked Out.'
            }
        ];
        this.attacks = [
            {
                name: 'A Bit Much',
                cost: [C],
                damage: 500,
                text: ''
            },
        ];
        this.set = 'TEST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Test Pokemon';
        this.fullName = 'Test Pokemon TEST';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 60, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 999;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, cardList => {
                if (cardList.getPokemonCard() === opponentActive) {
                    const damageEffect = new game_effects_1.EffectOfAbilityEffect(player, this.powers[0], this, state, [cardList]);
                    store.reduceEffect(state, damageEffect);
                    if (damageEffect.target) {
                        damageEffect.target.damage += 999;
                    }
                }
            });
        }
        return state;
    }
}
exports.TestPokemon = TestPokemon;
