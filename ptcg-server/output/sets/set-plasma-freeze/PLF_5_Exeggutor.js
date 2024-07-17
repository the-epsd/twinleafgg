"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exeggutor = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Exeggutor extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Exeggcute';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.WATER, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Blockade',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'Your opponent can\'t play any Supporter cards from his or her hand during his or her next turn.'
            },
            {
                name: 'Stomp',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'Flip a coin. If heads, this attack does 30 more damage. '
            }];
        this.set = 'PLF';
        this.setNumber = '5';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Exeggutor';
        this.fullName = 'Exeggutor PLF';
        this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 30;
                }
            });
        }
        if (effect instanceof play_card_effects_1.PlaySupporterEffect) {
            const player = effect.player;
            if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_SUPPORTER_CARDS_MARKER, this);
        }
        return state;
    }
}
exports.Exeggutor = Exeggutor;
