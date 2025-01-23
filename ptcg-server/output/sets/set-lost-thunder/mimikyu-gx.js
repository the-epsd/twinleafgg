"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimikyuGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const card_types_2 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MimikyuGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 170;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Perplex',
                cost: [card_types_1.CardType.FAIRY],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused.'
            },
            {
                name: 'Let\'s Snuggle and Fall',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.COLORLESS],
                damage: 10,
                text: 'This attack does 30 more damage for each damage counter on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Dream Fear-GX',
                cost: [card_types_1.CardType.FAIRY],
                damage: 0,
                text: 'Choose 1 of your opponent\'s Benched Pokémon. Your opponent shuffles that Pokémon and all cards attached to it into their deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'LOT';
        this.setNumber = '149';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Mimikyu-GX';
        this.fullName = 'Mimikyu-GX LOT';
    }
    reduceEffect(store, state, effect) {
        // Perplex
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_2.SpecialCondition.CONFUSED]);
            return store.reduceEffect(state, specialCondition);
        }
        // Let's Snuggle and Fall
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            effect.damage += opponent.active.damage * 3;
        }
        // Dream Fear-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selection => {
                selection.forEach(r => {
                    r.moveTo(opponent.deck);
                    r.clearEffects();
                });
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.MimikyuGX = MimikyuGX;
