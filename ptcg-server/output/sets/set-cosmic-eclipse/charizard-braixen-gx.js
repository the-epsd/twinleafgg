"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharizardBraixenGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class CharizardBraixenGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.cardType = R;
        this.hp = 270;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Brilliant Flare',
                cost: [R, R, R, C],
                damage: 180,
                text: 'You may search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Crimson Flame Pillar-GX',
                cost: [R],
                damage: 0,
                text: 'Attach 5 basic Energy cards from your discard pile to your Pokémon in any way you like. If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack\'s cost), your opponent\'s Active Pokémon is now Burned and Confused. (You can\'t use more than 1 GX attack in a game.)'
            },
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Charizard & Braixen-GX';
        this.fullName = 'Charizard & Braixen-GX CEC';
    }
    reduceEffect(store, state, effect) {
        // Brilliant Flare
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0])
            prefabs_1.SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, 0, 3);
        // Crimson Flame Pillar-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 5 }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
            });
            // Check for the extra energy cost.
            const extraEffectCost = [R, C];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
            active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
        }
        return state;
    }
}
exports.CharizardBraixenGX = CharizardBraixenGX;
