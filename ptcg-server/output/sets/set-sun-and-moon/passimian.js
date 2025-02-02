"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassimianSUM = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_1 = require("../../game");
class PassimianSUM extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Fling',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }, {
                name: 'Team Play',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 30 more damage for each of your Benched Passimian.'
            }];
        this.set = 'SUM';
        this.setNumber = '73';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Passimian';
        this.fullName = 'Passimian SUM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let numPassimians = 0;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList === player.active) {
                    return;
                }
                if (card.name === 'Passimian') {
                    numPassimians++;
                }
            });
            effect.damage += numPassimians * 30;
        }
        return state;
    }
}
exports.PassimianSUM = PassimianSUM;
