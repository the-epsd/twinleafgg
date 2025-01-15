"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyiniumZAirSlash = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class FlyiniumZAirSlash extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '195';
        this.name = 'Flyinium Z: Air Slash';
        this.fullName = 'Flyinium Z: Air Slash UNM';
        this.attacks = [{
                name: 'Speeding Skystrike GX',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
            }];
        this.text = 'If the Pokémon this card is attached to has the Air Slash attack, it can use the GX attack on this card. (You still need the necessary Energy to use this attack.)';
        this.FLYINIUM_Z_MARKER = 'FLYINIUM_Z_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a, _b, _c;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            if (!((_b = effect.player.active.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.attacks.some(attack => attack.name === 'Air Slash'))) {
                return state;
            }
            effect.attacks.push(this.attacks[0]);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            cardList.marker.addMarker(this.FLYINIUM_Z_MARKER, this);
            player.usedGX = true;
            return state;
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.FLYINIUM_Z_MARKER, this)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner !== player) {
                (_c = cardList.marker) === null || _c === void 0 ? void 0 : _c.removeMarker(this.FLYINIUM_Z_MARKER, this);
            }
        }
        return state;
    }
}
exports.FlyiniumZAirSlash = FlyiniumZAirSlash;
