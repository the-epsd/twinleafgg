"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallade = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Gallade extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kirlia';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Powerful Storm',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 damage times the amount of Energy attached to all of ' +
                    'your Pokemon.'
            },
            {
                name: 'Swift Lunge',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'Your opponent switches the Defending Pokemon with ' +
                    '1 of his or her Benched Pokemon.'
            },
        ];
        this.set = 'PLS';
        this.name = 'Gallade';
        this.fullName = 'Gallade PLS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let energies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    energies += energy.provides.length;
                });
            });
            effect.damage = 20 * energies;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_message_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                opponent.switchPokemon(target);
            });
        }
        return state;
    }
}
exports.Gallade = Gallade;
