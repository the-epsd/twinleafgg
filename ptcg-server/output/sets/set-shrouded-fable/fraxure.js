"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraxure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Fraxure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Axew';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 100;
        this.weakness = [];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Unnerve',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokemon.'
            }];
        this.attacks = [{
                name: 'Dragon Pulse',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 80,
                text: 'Discard the top card of your deck'
            }];
        this.set = 'SFA';
        this.name = 'Fraxure';
        this.fullName = 'Fraxure SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '45';
        this.regulationMark = 'H';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 1);
            const discards = deckTop.cards;
            deckTop.moveTo(player.discard, deckTop.cards.length);
            discards.forEach((card, index) => {
                store.log(state, game_1.GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: card.name, effectName: effect.attack.name });
            });
            return state;
        }
        return state;
    }
}
exports.Fraxure = Fraxure;
