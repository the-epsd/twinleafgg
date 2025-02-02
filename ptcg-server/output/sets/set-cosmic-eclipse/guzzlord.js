"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guzzlord = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Guzzlord extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 150;
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Mountain Munch',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            },
            {
                name: 'Red Banquet',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from this attack, take 1 more Prize card.'
            }];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Guzzlord';
        this.fullName = 'Guzzlord CEC';
        this.usedRedBanquet = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedRedBanquet = false;
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            this.usedRedBanquet = true;
        }
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Guzzy wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Red Banquet"
            if (this.usedRedBanquet === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    this.usedRedBanquet = false;
                }
            }
            return state;
        }
        return state;
    }
}
exports.Guzzlord = Guzzlord;
