"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeismitoadEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class SeismitoadEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Quaking Punch',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: 'Your opponent can\'t play any Item cards from his or her hand ' +
                    'during his or her next turn.'
            }, {
                name: 'Grenade Hammer',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'This attack does 30 damage to 2 of your Benched Pokemon. ' +
                    '(Don\'t apply Weakness and Resistance for Benched Pokemon.)'
            },
        ];
        this.set = 'FFI';
        this.name = 'Seismitoad EX';
        this.fullName = 'Seismitoad EX FFI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.QUAKING_PUNCH_MAREKER = 'QUAKING_PUNCH_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.QUAKING_PUNCH_MAREKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched === 0) {
                return state;
            }
            const max = Math.min(2, benched);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: max, max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.QUAKING_PUNCH_MAREKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.QUAKING_PUNCH_MAREKER, this);
        }
        return state;
    }
}
exports.SeismitoadEx = SeismitoadEx;
