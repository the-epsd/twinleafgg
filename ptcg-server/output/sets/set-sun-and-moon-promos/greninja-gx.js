"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreninjaGXSMP = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class GreninjaGXSMP extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Frogadier';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Elusive Master',
                powerType: game_1.PowerType.ABILITY,
                useFromHand: true,
                text: 'Once during your turn (before your attack), if this Pokémon is the last card in your hand, you may play it onto your Bench. If you do, draw 3 cards.'
            }];
        this.attacks = [
            {
                name: 'Mist Slash',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, or any other effects on your opponent\'s Active Pokémon.'
            },
            {
                name: 'Dark Mist-GX',
                cost: [card_types_1.CardType.WATER],
                damage: 0,
                text: 'Put 1 of your opponent\'s Benched Pokémon and all cards attached to it into your opponent\'s hand. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SMP';
        this.setNumber = 'SM197';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Greninja-GX';
        this.fullName = 'Greninja-GX SMP';
    }
    reduceEffect(store, state, effect) {
        // Elusive Master
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.hand.cards.filter(c => c !== this).length !== 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            prefabs_1.PLAY_POKEMON_FROM_HAND_TO_BENCH(state, player, this);
            player.deck.moveTo(player.hand, 3);
        }
        // Mist Slash
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, 130);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        // Dark Mist-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
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
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selection => {
                selection.forEach(r => {
                    r.moveTo(opponent.hand);
                    r.clearEffects();
                });
            });
        }
        return state;
    }
}
exports.GreninjaGXSMP = GreninjaGXSMP;
