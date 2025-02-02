"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronHandsex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
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
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 160,
                text: ''
            },
            {
                name: 'Amp You Very Much',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
            },
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Iron Hands ex';
        this.fullName = 'Iron Hands ex PAR';
        this.usedAmpYouVeryMuch = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedAmpYouVeryMuch = false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            this.usedAmpYouVeryMuch = true;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Iron Hands wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Amp You Very Much"
            if (this.usedAmpYouVeryMuch === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    this.usedAmpYouVeryMuch = false;
                }
            }
            return state;
        }
        return state;
    }
}
exports.IronHandsex = IronHandsex;
