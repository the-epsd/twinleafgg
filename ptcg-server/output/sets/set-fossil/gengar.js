"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
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
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.evolvesFrom = 'Haunter';
        this.cardType = P;
        this.hp = 80;
        this.resistance = [{ type: F, value: -30 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Curse',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), you may move 1 damage counter from 1 of your opponent\'s Pokémon to another(even if it would Knock Out the other Pokémon).This power can\'t be used if Gengar is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [{
                name: 'Dark Mind',
                cost: [P, P, P],
                damage: 30,
                text: 'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Gengar';
        this.fullName = 'Gengar FO';
        this.CURSE_MARKER = 'CURSE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            console.log('Opponent active cards:', opponent.active.cards); // Add this line
            if (opponent.active.cards.length > 0 && opponent.active.cards[0] instanceof pokemon_card_1.PokemonCard) {
                const opponentActivePokemon = opponent.active.cards[0];
                console.log('Opponent active Pokemon:', opponentActivePokemon); // Add this line
                if (opponentActivePokemon.attacks && opponentActivePokemon.attacks.length > 0) {
                    console.log('Opponent Active\'s First Attack:', opponentActivePokemon.attacks[0]);
                }
            }
            const damagedPokemon = [
                ...opponent.bench.filter(b => b.cards.length > 0 && b.damage > 0),
                ...(opponent.active.damage > 0 ? [opponent.active] : [])
            ];
            if (player.marker.hasMarker(this.CURSE_MARKER, this)) {
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
                player.marker.addMarker(this.CURSE_MARKER, this);
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
                    prefabs_1.ABILITY_USED(player, this);
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new __1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, play_card_action_1.PlayerType.TOP_PLAYER, [play_card_action_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 10);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                });
                return state;
            });
        }
        return state;
    }
}
exports.Gengar = Gengar;
