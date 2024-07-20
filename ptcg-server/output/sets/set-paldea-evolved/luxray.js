"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Luxray = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Luxray extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Luxio';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Swelling Flash',
                powerType: game_1.PowerType.ABILITY,
                text: ''
            }];
        this.attacks = [{
                name: 'Wild Charge',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'This Pokémon also does 20 damage to itself.'
            }];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '71';
        this.name = 'Luxray';
        this.fullName = 'Luxray PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect
            && effect.power.powerType === game_1.PowerType.ABILITY
            && effect.power.name !== 'Swelling Flash') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.getPrizeLeft() < opponent.getPrizeLeft()) {
                const canPlayLuxray = player.hand.cards.some(c => {
                    return c instanceof pokemon_card_1.PokemonCard && c.cards.filter(this);
                });
                if (canPlayLuxray) {
                    this.stage = card_types_1.Stage.BASIC;
                }
                return state;
            }
            return state;
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            this.stage = card_types_1.Stage.STAGE_2;
        }
        return state;
    }
}
exports.Luxray = Luxray;
