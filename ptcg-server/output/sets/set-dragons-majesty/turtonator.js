"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turtonator = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
class Turtonator extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = N;
        this.hp = 110;
        this.weakness = [{ type: Y }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Explosive Jet',
                cost: [R, R, R],
                damage: 50,
                damageCalculation: 'x',
                text: 'Discard any amount of [R] Energy from your Pokémon. This attack does 50 damage for each card you discarded in this way.'
            }
        ];
        this.set = 'DRM';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Turtonator';
        this.fullName = 'Turtonator DRM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let totalFireEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const fireCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Fire Energy').length;
                totalFireEnergy += fireCount;
            });
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { min: 1, max: totalFireEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return state;
                }
                // Move all selected energies to discard
                transfers.forEach(transfer => {
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    source.moveCardTo(transfer.card, player.discard);
                });
                // Set damage based on number of discarded cards
                effect.damage = transfers.length * 50;
                return state;
            });
        }
        return state;
    }
}
exports.Turtonator = Turtonator;
