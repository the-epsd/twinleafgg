"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonchkrowGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HonchkrowGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Murkrow';
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.cardType = D;
        this.hp = 210;
        this.weakness = [{ type: L }];
        this.resistance = [{ type: F, value: -20 }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Ruler of the Night',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, your opponent can\'t play any Pokémon Tool, Special Energy, or Stadium cards from their hand.'
            }];
        this.attacks = [
            {
                name: 'Feather Storm',
                cost: [D, C, C],
                damage: 90,
                text: 'This attack does 30 damage to 2 of your opponent\'s Benched Pokémon-GX and Pokémon-EX. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
            },
            {
                name: 'Unfair-GX',
                cost: [C, C],
                damage: 0,
                gxAttack: true,
                text: 'Your opponent reveals their hand. Discard 2 cards from it. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '109';
        this.name = 'Honchkrow-GX';
        this.fullName = 'Honchkrow-GX UNB';
    }
    reduceEffect(store, state, effect) {
        // Ruler of the Night
        if ((effect instanceof play_card_effects_1.AttachEnergyEffect && effect.energyCard.energyType === card_types_1.EnergyType.SPECIAL) || effect instanceof play_card_effects_1.PlayStadiumEffect || effect instanceof play_card_effects_1.AttachPokemonToolEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(effect.player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
        }
        // Feather Storm
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            let gxsEXsOnBench = 0;
            const blockedTo = [];
            opponent.bench.forEach((bench, index) => {
                var _a, _b, _c;
                if (bench.cards.length === 0) {
                    return;
                }
                if (((_a = bench.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tags.includes(card_types_1.CardTag.POKEMON_EX)) || ((_b = bench.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.tags.includes(card_types_1.CardTag.POKEMON_GX)) || ((_c = bench.getPokemonCard()) === null || _c === void 0 ? void 0 : _c.tags.includes(card_types_1.CardTag.TAG_TEAM))) {
                    gxsEXsOnBench++;
                }
                else {
                    const target = {
                        player: game_1.PlayerType.BOTTOM_PLAYER,
                        slot: game_1.SlotType.BENCH,
                        index
                    };
                    blockedTo.push(target);
                }
            });
            if (!gxsEXsOnBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: Math.min(gxsEXsOnBench, 2), max: Math.min(gxsEXsOnBench, 2), allowCancel: false, blocked: blockedTo }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                for (const target of targets) {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                }
            });
        }
        // Unfair-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedGX) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            if (opponent.hand.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { allowCancel: false, min: Math.min(opponent.hand.cards.length, 2), max: Math.min(opponent.hand.cards.length, 2) }), cards => {
                cards = cards || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
        }
        return state;
    }
}
exports.HonchkrowGX = HonchkrowGX;
