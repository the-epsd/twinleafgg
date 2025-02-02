"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantAlakazam = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RadiantAlakazam extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.RADIANT];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Painful Spoons',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may move up to 2 damage ' +
                    'counters from 1 of your opponent\'s Pokémon to another of ' +
                    'their Pokémon.'
            }];
        this.attacks = [{
                name: 'Mind Ruler',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each card in your ' +
                    'opponent\'s hand.'
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
        this.name = 'Radiant Alakazam';
        this.fullName = 'Radiant Alakazam SIT';
        this.PAINFUL_SPOONS_MARKER = 'PAINFUL_SPOONS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const damagedPokemon = [
                ...opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0),
                ...(opponent.active.damage > 0 ? [opponent.active] : [])
            ];
            if (player.marker.hasMarker(this.PAINFUL_SPOONS_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (damagedPokemon.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const maxAllowedDamage = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 2, allowCancel: false, singleDestinationTarget: true }), transfers => {
                player.marker.addMarker(this.PAINFUL_SPOONS_MARKER, this);
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                    if (source.damage == 10) {
                        source.damage -= 10;
                        target.damage += 10;
                    }
                    if (source.damage >= 10) {
                        source.damage -= 20;
                        target.damage += 20;
                    }
                    player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const oppHand = opponent.hand.cards.length;
            effect.damage = 20 * oppHand;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.PAINFUL_SPOONS_MARKER);
            return state;
        }
        return state;
    }
}
exports.RadiantAlakazam = RadiantAlakazam;
