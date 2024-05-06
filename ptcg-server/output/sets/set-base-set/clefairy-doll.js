"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClefairyDoll = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ClefairyDoll extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.name = 'Clefairy Doll';
        this.setNumber = '70';
        this.set = 'BS';
        this.fullName = 'Clefairy Doll BS';
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 10;
        this.cardType = card_types_1.CardType.NONE;
        this.attacks = [];
        this.powers = [
            {
                name: 'Clefairy Doll',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                exemptFromAbilityLock: true,
                text: 'At any time during your turn before your attack, you may discard Clefairy Doll.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        this.superType = card_types_1.SuperType.TRAINER;
        // Clefairy Doll can't be affected by special conditions
        if (effect instanceof attack_effects_1.AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
            effect.preventDefault = true;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0] && effect.card === this) {
            this.superType = card_types_1.SuperType.POKEMON;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const player = effect.player;
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex !== -1) {
                const cardList = player.bench[benchIndex];
                cardList.moveCardTo(this, player.discard);
            }
            else {
                player.active.moveCardTo(this, player.discard);
            }
            return state;
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.cards.includes(this)) {
            throw new game_1.GameError(game_1.GameMessage.CANNOT_RETREAT);
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target.cards.includes(this)) {
            effect.prizeCount = 0;
        }
        return state;
    }
}
exports.ClefairyDoll = ClefairyDoll;
