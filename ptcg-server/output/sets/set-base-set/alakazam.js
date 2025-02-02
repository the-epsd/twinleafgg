"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alakazam = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const check_effects_1 = require("../../game/store/effects/check-effects");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const move_damage_prompt_1 = require("../../game/store/prompts/move-damage-prompt");
const game_message_1 = require("../../game/game-message");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Alakazam extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Kadabra';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Damage Swap',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'As often as you like during your turn (before your attack), you may move 1 damage counter from 1 of your Pokémon to another as long as you don\'t Knock Out that Pokémon. This power can\'t be used if Alakazam is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Shadow Punch',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Alakazam';
        this.fullName = 'Alakazam BS';
        this.DAMAGE_SWAP_MARKER = 'DAMAGE_SWAP_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const cardList = state_utils_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            const damagedPokemon = [
                ...opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0),
                ...(opponent.active.damage > 0 ? [opponent.active] : [])
            ];
            if (player.marker.hasMarker(this.DAMAGE_SWAP_MARKER, this)) {
                throw new __1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (damagedPokemon.length === 0) {
                throw new __1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const maxAllowedDamage = [];
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkHpEffect = new check_effects_1.CheckHpEffect(player, cardList);
                store.reduceEffect(state, checkHpEffect);
                maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
            });
            return store.prompt(state, new move_damage_prompt_1.MoveDamagePrompt(effect.player.id, game_message_1.GameMessage.MOVE_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.ACTIVE, play_card_action_1.SlotType.BENCH], maxAllowedDamage, { min: 1, max: 1, allowCancel: false, singleDestinationTarget: true }), transfers => {
                player.marker.addMarker(this.DAMAGE_SWAP_MARKER, this);
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
                        source.damage -= 10;
                        target.damage += 10;
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
            return store.prompt(state, [
                new __1.CoinFlipPrompt(player.id, game_message_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
        }
        return state;
    }
}
exports.Alakazam = Alakazam;
