"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LurantisGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class LurantisGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Fomantis';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 210;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Flower Supply',
                cost: [card_types_1.CardType.GRASS],
                damage: 40,
                text: 'Attach 2 basic Energy cards from your discard pile to your Pokémon in any way you like.'
            },
            {
                name: 'Solar Blade',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Heal 30 damage from this Pokemon'
            },
            {
                name: 'Chloroscythe-GX',
                cost: [card_types_1.CardType.GRASS],
                damage: 50,
                gxAttack: true,
                text: 'This attack does 50 damage times the amount of [G] Energy attached to this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'SUM';
        this.setNumber = '15';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Lurantis-GX';
        this.fullName = 'Lurantis-GX SUM';
    }
    reduceEffect(store, state, effect) {
        // Flower Supply
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
        }
        // Solar Blade
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const healTargetEffect = new attack_effects_1.HealTargetEffect(effect, 30);
            healTargetEffect.target = player.active;
            state = store.reduceEffect(state, healTargetEffect);
        }
        // Chloroscythe-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            let energyCount = 0;
            checkProvidedEnergyEffect.energyMap.forEach(em => {
                energyCount += em.provides.filter(cardType => {
                    return cardType === card_types_1.CardType.GRASS || cardType === card_types_1.CardType.ANY;
                }).length;
            });
            effect.damage = energyCount * 50;
        }
        return state;
    }
}
exports.LurantisGX = LurantisGX;
