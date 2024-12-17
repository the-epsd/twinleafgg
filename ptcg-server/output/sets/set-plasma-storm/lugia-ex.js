"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LugiaEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
class LugiaEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_EX, card_types_1.CardTag.TEAM_PLASMA];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Overflow',
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
                    'attack of this Pokemon, take 1 more Prize card.'
            }];
        this.attacks = [{
                name: 'Chilling Sigh',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Discard a Plasma Energy attached to this Pokémon. If you can\'t discard a Plasma Energy, this attack does nothing.'
            }];
        this.set = 'PLS';
        this.name = 'Lugia EX';
        this.fullName = 'Lugia EX PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            let cards = [];
            const player = effect.player;
            const pokemon = player.active;
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, pokemon);
            store.reduceEffect(state, checkEnergy);
            checkEnergy.energyMap.forEach(em => {
                const energyCard = em.card;
                if (energyCard instanceof game_1.EnergyCard && energyCard.name !== 'Plasma Energy') {
                    effect.damage = 0;
                    return state;
                }
                if (energyCard instanceof game_1.EnergyCard && energyCard.name == 'Plasma Energy')
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.active, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL, name: 'Plasma Energy' }, { min: 1, max: 1, allowCancel: false }), selected => {
                        cards = selected || [];
                        if (cards.length === 0) {
                            return;
                        }
                        player.active.moveCardsTo(cards, player.discard);
                    });
            });
            // Overflow
            if (effect instanceof game_effects_1.KnockOutEffect && effect.target === effect.player.active) {
                const player = effect.player;
                const opponent = state_utils_1.StateUtils.getOpponent(state, player);
                // Do not activate between turns, or when it's not opponents turn.
                if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                    return state;
                }
                // Lugia wasn't attacking
                const pokemonCard = opponent.active.getPokemonCard();
                if (pokemonCard !== this) {
                    return state;
                }
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: pokemon_types_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 1;
                    return state;
                }
            }
            return state;
        }
        return state;
    }
}
exports.LugiaEx = LugiaEx;
