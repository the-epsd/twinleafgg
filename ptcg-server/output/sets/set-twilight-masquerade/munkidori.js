"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Munkidori = void 0;
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Munkidori extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 110;
        this.weakness = [{ type: game_1.CardType.DARK }];
        this.resistance = [{ type: game_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Refinement',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard a card from your hand in order to use ' +
                    'this Ability. Once during your turn, you may draw 2 cards.'
            }];
        this.attacks = [
            {
                name: 'Damage Collector',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Move any number of damage counters from your opponent\'s Benched Pokémon to their Active Pokémon.'
            }
        ];
        this.set = 'SV6';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '55';
        this.name = 'Munkidori';
        this.fullName = 'Munkidori SV6';
        this.REFINEMENT_MARKER = 'REFINEMENT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.REFINEMENT_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.damage > 0) {
                    return state;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!blocked.length) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (blocked.length) {
                // Opponent has damaged benched Pokemon
                const maxAllowedDamage = [];
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    const checkHpEffect = new check_effects_1.CheckHpEffect(opponent, cardList);
                    store.reduceEffect(state, checkHpEffect);
                    maxAllowedDamage.push({ target, damage: 30 });
                });
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList == player.active || player.bench.includes(cardList)) {
                        const source = game_1.StateUtils.getTarget(state, player, target);
                        if (source.damage >= 30) {
                            source.damage -= 30;
                        }
                    }
                });
                const blockedFrom = [];
                const blockedTo = [];
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList == player.active || player.bench.includes(cardList)) {
                        blockedTo.push(target);
                    }
                });
                opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                    if (cardList == opponent.active || opponent.bench.includes(cardList)) {
                        blockedFrom.push(target);
                    }
                });
                return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { blockedFrom, blockedTo, max: 1, allowCancel: false }), transfers => {
                    if (transfers === null) {
                        return state;
                    }
                    for (const transfer of transfers) {
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        if (source.damage >= 30) {
                            source.damage -= 30;
                        }
                    }
                    return store.prompt(state, new game_1.MoveDamagePrompt(effect.player.id, game_1.GameMessage.MOVE_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], maxAllowedDamage, { blockedFrom, blockedTo, max: 1, allowCancel: false }), transfers => {
                        if (transfers === null) {
                            return state;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            target.damage += 30;
                        }
                    });
                });
            }
        }
        return state;
    }
}
exports.Munkidori = Munkidori;
