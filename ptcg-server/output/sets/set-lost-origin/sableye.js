"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sableye = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const __1 = require("../..");
function* useLostMine(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 120 });
    });
    const damage = 120;
    if (player.lostzone.cards.length <= 9) {
        throw new __1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
    }
    if (player.lostzone.cards.length >= 10) {
        return store.prompt(state, new __1.PutDamagePrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: false }), targets => {
            const results = targets || [];
            for (const result of results) {
                const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                const putCountersEffect = new attack_effects_1.PutCountersEffect(effect, result.damage);
                putCountersEffect.target = target;
                store.reduceEffect(state, putCountersEffect);
            }
        });
    }
}
class Sableye extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Scratch',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: ''
            }, {
                name: 'Lost Mine',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Put 12 damage counters on your opponent\'s Pokémon in any way you like.'
            }];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '70';
        this.name = 'Sableye';
        this.fullName = 'Sableye LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useLostMine(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Sableye = Sableye;
