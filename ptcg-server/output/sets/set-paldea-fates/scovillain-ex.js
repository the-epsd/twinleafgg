"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scovillainex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Scovillainex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Capsakid';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Chili Snapper Bind',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Burned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
            },
            {
                name: 'Two-Headed Crushing',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 140,
                text: 'Discard a random card from your opponent\'s hand. Discard the top card of your opponent\'s deck.'
            }
        ];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '37';
        this.set = 'PAF';
        this.name = 'Scovillain ex';
        this.fullName = 'Scovillain ex PAF';
        this.SPICY_BIND_MARKER = 'SPICY_BIND_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.BURNED]);
            store.reduceEffect(state, specialConditionEffect);
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.SPICY_BIND_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.SPICY_BIND_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.SPICY_BIND_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.hand.cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
                const randomCard = opponent.hand.cards[randomIndex];
                opponent.hand.moveCardTo(randomCard, opponent.discard);
            }
        }
        return state;
    }
}
exports.Scovillainex = Scovillainex;
