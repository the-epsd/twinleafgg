"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlastoisePiplupGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class BlastoisePiplupGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = W;
        this.hp = 270;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Splash Maker',
                cost: [W, W, C],
                damage: 150,
                text: 'You may attach up to 3 [W] Energy cards from your hand to your Pokémon in any way you like. If you do, heal 50 damage from those Pokémon for each card you attached to them in this way.'
            },
            {
                name: 'Bubble Launcher-GX',
                cost: [W, W, C],
                damage: 100,
                damageCalculation: '+',
                text: 'Your opponent\'s Active Pokémon is now Paralyzed. If this Pokémon has at least 3 extra [W] Energy attached to it (in addition to this attack\'s cost), this attack does 150 more damage. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Blastoise & Piplup-GX';
        this.fullName = 'Blastoise & Piplup-GX CEC';
    }
    reduceEffect(store, state, effect) {
        // Splash Maker
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { allowCancel: false, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                    const healing = new attack_effects_1.HealTargetEffect(effect, 50);
                    healing.target = target;
                    store.reduceEffect(state, healing);
                }
            });
        }
        // Crimson Flame Pillar-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.addSpecialCondition(card_types_1.SpecialCondition.PARALYZED);
            // Check for the extra energy cost.
            const extraEffectCost = [W, W, W, W, W, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            effect.damage += 150;
        }
        return state;
    }
}
exports.BlastoisePiplupGX = BlastoisePiplupGX;
