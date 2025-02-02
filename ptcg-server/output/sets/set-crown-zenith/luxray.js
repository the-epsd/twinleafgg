"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.tags = [card_types_1.CardTag.PLAY_DURING_SETUP];
        this.evolvesFrom = 'Luxio';
        this.cardType = L;
        this.hp = 160;
        this.weakness = [{ type: F }];
        this.retreat = [];
        this.powers = [{
                name: 'Explosiveness',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Seeking Fang',
                cost: [C],
                damage: 50,
                text: 'Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.'
            }];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '44';
        this.name = 'Luxray';
        this.fullName = 'Luxray CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER }, { min: 0, max: 2, allowCancel: false }), selected => {
                const cards = selected || [];
                store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                    player.deck.moveCardsTo(cards, player.hand);
                });
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Luxray = Luxray;
