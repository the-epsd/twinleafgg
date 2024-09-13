"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jynx = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Jynx extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 100;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Alluring Dance',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. The new Active Pokémon is now Confused.'
            }, {
                name: 'Super Psy Bolt',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Jynx';
        this.fullName = 'Jynx LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                opponent.active.specialConditions.push(game_1.SpecialCondition.CONFUSED);
            });
        }
        return state;
    }
}
exports.Jynx = Jynx;
