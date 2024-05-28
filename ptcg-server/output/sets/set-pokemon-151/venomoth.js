"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Venomoth = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Venomoth extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Venonat';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Perplexing Powder',
                cost: [card_types_1.CardType.GRASS],
                damage: 30,
                text: 'Your opponent\'s Active Pokémon is now Confused. During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
            },
            {
                name: 'Speed Wing',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: '',
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '49';
        this.name = 'Venomoth';
        this.fullName = 'Venomoth MEW';
        this.PERPLEXING_POWDER_MARKER = 'PERPLEXING_POWDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.specialConditions.push(card_types_1.SpecialCondition.CONFUSED);
            opponent.marker.addMarker(this.PERPLEXING_POWDER_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.PERPLEXING_POWDER_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.PERPLEXING_POWDER_MARKER, this);
        }
        return state;
    }
}
exports.Venomoth = Venomoth;
