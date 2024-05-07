"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pecharuntex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
class Pecharuntex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Chains of Control',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch 1 of your Benched Darkness Pkmn (excl. Pecharunt ex) with your Active. Your new Active is now Poisoned. You can\'t use more than 1 Chains of Control Ability per turn.'
            }];
        this.attacks = [{
                name: 'Irritating Burst',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 60,
                text: 'This attack does 60 damage for each Prize card your opponent has taken.'
            }];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Pecharunt ex';
        this.fullName = 'Pecharunt ex SV6a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 60;
            effect.damage = prizesTaken * damagePerPrize;
        }
        return state;
    }
}
exports.Pecharuntex = Pecharuntex;
