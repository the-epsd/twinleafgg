"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianGrowlithe = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class HisuianGrowlithe extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Defensive Posture',
                cost: [],
                damage: 0,
                text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage done to this Pokémon by attacks. '
            },
            {
                name: 'Bite',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Hisuian Growlithe';
        this.fullName = 'Hisuian Growlithe ASR';
        this.CLEAR_DEFENSIVE_POSTURE_MARKER = 'CLEAR_WITHDRAW_MARKER';
        this.DEFENSIVE_POSTURE_MARKER = 'WITHDRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            return store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), flipResult => {
                if (flipResult) {
                    player.active.marker.addMarker(this.DEFENSIVE_POSTURE_MARKER, this);
                    opponent.marker.addMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect
            && effect.target.marker.hasMarker(this.DEFENSIVE_POSTURE_MARKER)) {
            effect.preventDefault = true;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect
            && effect.player.marker.hasMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this)) {
            effect.player.marker.removeMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.DEFENSIVE_POSTURE_MARKER, this);
            });
        }
        return state;
    }
}
exports.HisuianGrowlithe = HisuianGrowlithe;
