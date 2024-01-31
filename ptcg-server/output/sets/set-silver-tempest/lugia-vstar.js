"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LugiaVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class LugiaVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Lugia V';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 280;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Summoning Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Search your deck for up to 2 Basic Pokemon and put them onto ' +
                    'your Bench. Shuffle your deck afterward.'
            }
        ];
        this.attacks = [
            {
                name: 'Tempest Dive',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 220,
                text: 'You may discard a Stadium in play.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '139';
        this.name = 'Lugia VSTAR';
        this.fullName = 'Lugia VSTAR SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const slots = player.bench.filter(b => b.cards.length === 0);
            const max = Math.min(slots.length, 2);
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.usedVSTAR = true;
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, player.discard, { superType: card_types_1.SuperType.POKEMON, cardType: card_types_1.CardType.COLORLESS }, { min: 1, max, allowCancel: true }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, slots[index]);
                    slots[index].pokemonPlayedTurn = state.turn;
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                        return state;
                    }
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.LugiaVSTAR = LugiaVSTAR;
