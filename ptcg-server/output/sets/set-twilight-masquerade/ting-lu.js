"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TingLu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TingLu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Ground Crack',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 30,
                text: 'If a Stadium is in play, this attack does 30 damage to each of your opponent\'s Benched Pokémon. Then, discard that Stadium. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Hammer In',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Ting-Lu';
        this.fullName = 'Ting-Lu TWM';
        this.discardedStadiumCard = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard == undefined) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            this.discardedStadiumCard = true;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (cardList === opponent.active) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = cardList;
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect && this.discardedStadiumCard) {
            // Add stadium discard logic
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const owner = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(owner.discard);
                this.discardedStadiumCard = false;
            }
        }
        return state;
    }
}
exports.TingLu = TingLu;
