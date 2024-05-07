"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronHandsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class IronHandsex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Arm Press',
                cost: [],
                damage: 160,
                text: ''
            },
            {
                name: 'Amp You Very Much',
                cost: [],
                damage: 120,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
            },
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Iron Hands ex';
        this.fullName = 'Iron Hands ex PAR';
    }
    reduceEffect(store, state, effect) {
        //     if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
        //       const player = effect.player;
        //       const opponent = StateUtils.getOpponent(state, player);
        //       // Do not activate between turns, or when it's not opponents turn.
        //       if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        //         return state;
        //       }
        //       // Articuno wasn't attacking
        //       const pokemonCard = player.active.getPokemonCard();
        //       if (pokemonCard && pokemonCard.attacks.find(attack => attack.name === 'Amp You Very Much')) {
        //         effect.prizeCount += 1;
        //         return state;
        //       }
        //       return state;
        //     }
        //     return state;
        //   }
        // }
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.attack === this.attacks[1]) {
            if (effect instanceof game_effects_1.KnockOutEffect && effect.attack === this.attacks[1]) {
                effect.prizeCount += 1;
            }
            return state;
        }
        return state;
    }
}
exports.IronHandsex = IronHandsex;
