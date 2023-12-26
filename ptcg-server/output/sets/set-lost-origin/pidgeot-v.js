"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PidgeotV = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
class PidgeotV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Vanishing Wings',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may shuffle it and all attached cards into your deck.'
            }];
        this.attacks = [
            {
                name: 'Flight Surf',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If you have a Stadium in play, this attack does 80 more damage.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '137';
        this.name = 'Pidgeot V';
        this.fullName = 'Pidgeot V LOR';
    }
    // Implement ability
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                const cardList = player.bench.find(c => c.cards.includes(this));
                if (cardList) {
                    cardList.moveTo(player.deck);
                    cardList.clearEffects();
                }
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
                return state;
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                if (stadiumCard && stadiumCard.id === effect.player.id) {
                    effect.damage += 80;
                }
            }
            return state;
        }
        return state;
    }
}
exports.PidgeotV = PidgeotV;
