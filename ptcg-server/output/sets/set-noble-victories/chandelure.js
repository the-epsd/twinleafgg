"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chandelure = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const state_utils_1 = require("../../game/store/state-utils");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const put_damage_prompt_1 = require("../../game/store/prompts/put-damage-prompt");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_error_1 = require("../../game/game-error");
class Chandelure extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Lampent';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Cursed Shadow',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before attack), if this Pokemon is your ' +
                    'Active Pokemon, you may put 3 damage counters on your opponent\'s ' +
                    'Pokemon in any way you like.'
            }];
        this.attacks = [{
                name: 'Eerie Glow',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'The Defending Pokemon is now Burned and Confused.'
            }];
        this.set = 'NVI';
        this.name = 'Chandelure';
        this.fullName = 'Chandelure NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.CURSED_SHADOW_MAREKER = 'CURSED_SHADOW_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.CURSED_SHADOW_MAREKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            if (!player.active.cards.includes(this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.CURSED_SHADOW_MAREKER, this)) {
                throw new game_error_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            const maxAllowedDamage = [];
            let damageLeft = 0;
            opponent.forEachPokemon(play_card_action_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                store.reduceEffect(state, checkHpEffect);
                damageLeft += checkHpEffect.hp - cardList.damage;
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            const damage = Math.min(30, damageLeft);
            return store.prompt(state, new put_damage_prompt_1.PutDamagePrompt(effect.player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], damage, maxAllowedDamage, { allowCancel: true }), targets => {
                const results = targets || [];
                // cancelled by user
                if (results.length === 0) {
                    return;
                }
                player.marker.addMarker(this.CURSED_SHADOW_MAREKER, this);
                for (const result of results) {
                    const target = state_utils_1.StateUtils.getTarget(state, player, result.target);
                    target.damage += result.damage;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [
                card_types_1.SpecialCondition.BURNED,
                card_types_1.SpecialCondition.CONFUSED
            ]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.CURSED_SHADOW_MAREKER, this);
        }
        return state;
    }
}
exports.Chandelure = Chandelure;
