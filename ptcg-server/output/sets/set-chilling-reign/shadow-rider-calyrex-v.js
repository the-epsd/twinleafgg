"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowRiderCalyrexV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class ShadowRiderCalyrexV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Shadow Mist',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: 'During your opponent\'s next turn, they can\'t play any Special Energy or Stadium cards from their hand.'
            },
            {
                name: 'Astral Barrage',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose 2 of your opponent\'s Pokémon and put 5 damage counters on each of them.'
            },
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '74';
        this.name = 'Shadow Rider Calyrex V';
        this.fullName = 'Shadow Rider Calyrex V CRE';
        this.SHADOW_MIST_MARKER = 'SHADOW_MIST_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.SHADOW_MIST_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
            if (benched === 0) {
                return state;
            }
            const max = Math.min(2, benched);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: max, max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutCountersEffect(effect, 50);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
            });
        }
        if (effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SHADOW_MIST_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof play_card_effects_1.PlayStadiumEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SHADOW_MIST_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SHADOW_MIST_MARKER, this)) {
            effect.player.marker.removeMarker(this.SHADOW_MIST_MARKER, this);
        }
        return state;
    }
}
exports.ShadowRiderCalyrexV = ShadowRiderCalyrexV;
