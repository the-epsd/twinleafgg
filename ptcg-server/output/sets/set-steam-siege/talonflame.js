"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Talonflame = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Talonflame extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Fletchinder';
        this.tags = [game_1.CardTag.PLAY_DURING_SETUP];
        this.cardType = C;
        this.hp = 130;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [];
        this.powers = [{
                name: 'Gale Wings',
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon is in your hand when you are setting up to play, you may put it face down as your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Aero Blitz',
                cost: [C],
                damage: 40,
                text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.'
            }];
        this.set = 'STS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Talonflame';
        this.fullName = 'Talonflame STS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 2, allowCancel: false }), selected => {
                const cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Talonflame = Talonflame;
