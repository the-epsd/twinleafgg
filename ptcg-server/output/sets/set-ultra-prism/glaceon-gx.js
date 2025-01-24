"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlaceonGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GlaceonGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Freezing Gaze',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is your Active Pokémon, your opponent\'s Pokémon-GX and Pokémon-EX in play, in their hand, and in their discard pile have no Abilities, except for Freezing Gaze.'
            }];
        this.attacks = [
            {
                name: 'Frost Spear',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
            },
            {
                name: 'Polar Spear-GX',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'This attack does 50 damage for each damage counter on your opponent\'s Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'UPR';
        this.setNumber = '39';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Glaceon-GX';
        this.fullName = 'Glaceon-GX UPR';
    }
    reduceEffect(store, state, effect) {
        // Freezing Gaze
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.ABILITY && effect.power.name !== 'Freezing Gaze') {
            const player = effect.player;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            // checking if this is the active Pokemon
            if (player.active.getPokemonCard() !== this
                && opponent.active.getPokemonCard() !== this) {
                return state;
            }
            // checking if the effect is one you own
            let doesPlayerOwn = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    doesPlayerOwn = true;
                }
            });
            if (doesPlayerOwn) {
                return state;
            }
            if (effect.card.tags.includes(card_types_1.CardTag.POKEMON_GX) || effect.card.tags.includes(card_types_1.CardTag.POKEMON_EX)) {
                // Try to reduce PowerEffect, to check if something is blocking our ability
                try {
                    const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                    store.reduceEffect(state, powerEffect);
                }
                catch (_a) {
                    return state;
                }
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        // Frost Spear
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (!targets || targets.length === 0) {
                    return;
                }
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                damageEffect.target = targets[0];
                store.reduceEffect(state, damageEffect);
            });
        }
        // Polar Spear-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const opponent = game_2.StateUtils.getOpponent(state, player);
            effect.damage = 5 * opponent.active.damage;
        }
        return state;
    }
}
exports.GlaceonGX = GlaceonGX;
