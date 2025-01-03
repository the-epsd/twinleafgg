"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crocalor = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Crocalor extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fuecoco';
        this.cardType = game_1.CardType.FIRE;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Rolling Fireball',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE],
                damage: 90,
                text: 'Put an Energy attached to this Pokémon into your hand.'
            }];
        this.regulationMark = 'H';
        this.set = 'PAR';
        this.setNumber = '24';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Crocalor';
        this.fullName = 'Crocalor PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let card;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: game_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
                card = selected[0];
                player.active.moveCardTo(card, player.hand);
                return state;
            });
        }
        return state;
    }
}
exports.Crocalor = Crocalor;
