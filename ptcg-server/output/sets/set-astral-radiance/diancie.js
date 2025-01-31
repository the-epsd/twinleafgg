"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diancie = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Diancie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.powers = [{
                name: 'Princess\'s Curtain',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched Basic Pokémon.'
            }];
        this.attacks = [{
                name: 'Spike Draw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Draw 2 cards.'
            }];
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.set = 'ASR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Diancie';
        this.fullName = 'Diancie ASR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.SupporterEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (!opponent.active.cards.includes(this) || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            effect.preventDefault = true;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            prefabs_1.DRAW_CARDS(effect.player, 2);
        }
        return state;
    }
}
exports.Diancie = Diancie;
