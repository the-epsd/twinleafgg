"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TingLu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
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
                cost: [],
                damage: 30,
                text: 'If a Stadium is in play, this attack does 30 damage to each of your opponent\'s Benched Pokémon. Then, discard that Stadium. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Hammer In',
                cost: [],
                damage: 110,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '110';
        this.name = 'Ting-Lu';
        this.fullName = 'Ting-Lu TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard == undefined) {
                return state;
            }
            // Discard Stadium
            const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
            const player = game_1.StateUtils.findOwner(state, cardList);
            const opponent = game_1.StateUtils.getOpponent(state, player);

            const benched = opponent.bench.filter(b => b.cards.length > 0);
            benched.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = target;
                store.reduceEffect(state, damageEffect);
            });
            cardList.moveTo(player.discard);
        }
        return state;
    }
}
exports.TingLu = TingLu;
