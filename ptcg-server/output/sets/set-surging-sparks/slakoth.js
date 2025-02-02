"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlakothSSP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class SlakothSSP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Take It Easy',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Heal 60 damage from this Pokemon. During your next turn, this Pokemon can\'t retreat.'
            }
        ];
        this.set = 'SSP';
        this.setNumber = '145';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Slakoth';
        this.fullName = 'Slakoth SSP';
        this.CANT_RETREAT_NEXT_TURN_MARKER = 'CANT_RETREAT_NEXT_TURN_MARKER';
    }
    reduceEffect(store, state, effect) {
        // Take It Easy
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // Do heal effect
            const healEffect = new game_effects_1.HealEffect(player, cardList, 60);
            store.reduceEffect(state, healEffect);
            // Put a marker that states we can't retreat next turn
            player.marker.addMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this);
        }
        // Handle putting on the real "can't retreat this turn" marker on ourselves.
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const marker = effect.player.marker;
            if (marker.hasMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this)) {
                marker.addMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
            }
            marker.removeMarker(this.CANT_RETREAT_NEXT_TURN_MARKER, this);
        }
        // Handle no retreat effect for ourselves.
        if (effect instanceof check_effects_1.CheckRetreatCostEffect &&
            effect.player.active.marker.hasMarker(game_1.PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        return state;
    }
}
exports.SlakothSSP = SlakothSSP;
