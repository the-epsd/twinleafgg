"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoutlandV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class StoutlandV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Double Dip Fangs',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'If your opponent\'s Basic Pokémon is Knocked Out by damage from this attack, take 1 more Prize card.'
            },
            {
                name: 'Wild Tackle',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'This Pokémon also does 30 damage to itself.'
            }
        ];
        this.set = 'BST';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '117';
        this.name = 'Stoutland V';
        this.fullName = 'Stoutland V BST';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
            const attack = (_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.attacks[0];
            if (attack) {
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
                const activePokemon = opponent.active.getPokemonCard();
                if (activePokemon && activePokemon.stage === card_types_1.Stage.BASIC) {
                    if (effect.prizeCount > 0) {
                        effect.prizeCount += 1;
                        return state;
                    }
                }
                return state;
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const dealDamage = new attack_effects_1.DealDamageEffect(effect, 30);
                dealDamage.target = player.active;
                return store.reduceEffect(state, dealDamage);
            }
            return state;
        }
        return state;
    }
}
exports.StoutlandV = StoutlandV;
