"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shelgon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Shelgon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Bagon';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 100;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Guard Press',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'During your opponent’s next turn, this Pokémon takes 30 less damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Heavy Impact',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            },
        ];
        this.set = 'SV9';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Shelgon';
        this.fullName = 'Shelgon SV9';
        this.GUARD_PRESS = 'GUARD_PRESS';
        this.CLEAR_GUARD_PRESS = 'CLEAR_GUARD_PRESS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.GUARD_PRESS, this);
            opponent.marker.addMarker(this.CLEAR_GUARD_PRESS, this);
        }
        if (effect instanceof attack_effects_1.DealDamageEffect && effect.target.marker.hasMarker(this.GUARD_PRESS)) {
            effect.damage -= 30;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_GUARD_PRESS, this)) {
            effect.player.marker.removeMarker(this.CLEAR_GUARD_PRESS, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.GUARD_PRESS, this);
            });
        }
        return state;
    }
}
exports.Shelgon = Shelgon;
