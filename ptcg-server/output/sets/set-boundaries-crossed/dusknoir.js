"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dusknoir = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
function* useSinisterHand(next, store, state, effect) {
    const player = effect.player;
    const opponent = state_utils_1.StateUtils.getOpponent(state, player);
    const maxAllowedDamage = [];
    opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
    });
    return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { allowCancel: true }), transfers => {
        if (transfers === null) {
            return;
        }
        for (const transfer of transfers) {
            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            if (source.damage >= 10) {
                source.damage -= 10;
                target.damage += 10;
            }
        }
    });
}
class Dusknoir extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dusclops';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sinister Hand',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'As often as you like during your turn (before your attack), ' +
                    'you may move 1 damage counter from 1 of your opponent\'s Pokemon ' +
                    'to another of your opponent\'s Pokemon.'
            }];
        this.attacks = [{
                name: 'Shadow Punch',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }];
        this.set = 'BCR';
        this.name = 'Dusknoir';
        this.fullName = 'Dusknoir BCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useSinisterHand(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.ignoreResistance = true;
            return state;
        }
        return state;
    }
}
exports.Dusknoir = Dusknoir;
