"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Baltoy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Baltoy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = F;
        this.hp = 50;
        this.weakness = [{ type: G, value: +10 }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psychic Balance',
                cost: [C],
                damage: 0,
                text: 'If you have less cards in your hand than your opponent, draw cards until you have the same number of cards as your opponent. (If you have more or the same number of cards in your hand as your opponent, this attack does nothing.)'
            },
            {
                name: 'Spin Turn',
                cost: [F, C],
                damage: 20,
                text: 'Switch Baltoy with 1 of your Benched Pokémon.'
            }
        ];
        this.set = 'GE';
        this.setNumber = '60';
        this.name = 'Baltoy';
        this.fullName = 'Baltoy GE';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            while (player.hand.cards.length < opponent.hand.cards.length) {
                if (player.deck.cards.length === 0) {
                    break;
                }
                player.deck.moveTo(player.hand, 1);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: true }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        return state;
    }
}
exports.Baltoy = Baltoy;
