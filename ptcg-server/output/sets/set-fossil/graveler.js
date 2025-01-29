"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graveler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Graveler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Geodude';
        this.attacks = [{
                name: 'Harden',
                cost: [F, F],
                damage: 0,
                text: 'During your opponent\'s next turn, whenever 30 or less damage is done to Graveler (after applying Weakness and Resistance), prevent that damage. (Any other effects of attacks still happen.)'
            },
            {
                name: 'Rock Throw',
                cost: [F, F, C],
                damage: 40,
                text: ''
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.name = 'Graveler';
        this.fullName = 'Graveler FO';
        this.HARDEN_MARKER = 'HARDEN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.HARDEN_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.player.active.marker.hasMarker(this.HARDEN_MARKER, this)) {
            const damageBeingDealt = effect.damage;
            if (damageBeingDealt <= 30) {
                const damageEffect = new attack_effects_1.DealDamageEffect(effect, 0);
                damageEffect.target = effect.target;
                state = store.reduceEffect(state, damageEffect);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.marker.hasMarker(this.HARDEN_MARKER, this)) {
            effect.player.active.marker.removeMarker(this.HARDEN_MARKER, this);
        }
        return state;
    }
}
exports.Graveler = Graveler;
