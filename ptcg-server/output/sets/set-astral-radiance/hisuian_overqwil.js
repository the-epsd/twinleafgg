"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianOverqwil = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HisuianOverqwil extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Hisuian Qwilfish';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Tormenting Poison',
                cost: [],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 5 damage counters on that Pokémon instead of 1. '
            },
            {
                name: 'Pinning',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat. '
            }];
        this.set = 'ASR';
        this.setNumber = '90';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Hisuian Overqwil';
        this.fullName = 'Hisuian Overqwil ASR';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 50;
            store.reduceEffect(state, specialCondition);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        return state;
    }
}
exports.HisuianOverqwil = HisuianOverqwil;
