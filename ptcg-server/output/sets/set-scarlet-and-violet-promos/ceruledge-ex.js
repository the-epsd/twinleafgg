"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ceruledgeex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Ceruledgeex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Charcadet';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 270;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.attacks = [
            {
                name: 'Abyssal Flame',
                cost: [card_types_1.CardType.FIRE],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 20 more damage for each Energy card in your discard pile.'
            },
            {
                name: 'Amethyst Rage',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.PSYCHIC, card_types_1.CardType.METAL],
                damage: 280,
                text: 'Discard all Energy from this Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SVP';
        this.name = 'Ceruledge ex';
        this.fullName = 'Ceruledge ex SVP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '186';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const energyInDiscard = player.discard.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY).length;
            effect.damage += energyInDiscard * 20;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList) {
                const energyCards = cardList.cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
                energyCards.forEach(c => {
                    player.discard.cards.push(c);
                });
                cardList.cards = cardList.cards.filter(c => c.superType !== card_types_1.SuperType.ENERGY);
            }
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Ceruledgeex = Ceruledgeex;
