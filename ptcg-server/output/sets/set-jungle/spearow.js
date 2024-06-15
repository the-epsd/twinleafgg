"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spearow = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Spearow extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Peck',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: ''
            },
            {
                name: 'Mirror Move',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If Spearow was attacked last turn, do the final result of that attack on Spearow to the Defending Pokémon.'
            }
        ];
        this.set = 'JU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '62';
        this.name = 'Spearow';
        this.fullName = 'Spearow JU';
        this.mirrorMoveEffects = [];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            this.mirrorMoveEffects.forEach(effect => {
                effect.target = opponent.active;
                effect.opponent;
                effect.player = player;
                effect.source = player.active;
                // eslint-disable-next-line no-self-assign
                effect.attackEffect = effect.attackEffect;
                store.reduceEffect(state, effect.attackEffect);
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            this.mirrorMoveEffects.push(effect);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
                this.mirrorMoveEffects = [];
            }
            return state;
        }
        return state;
    }
}
exports.Spearow = Spearow;
