"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joltik = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Joltik extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Jolting Charge',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 2 Basic [G] Energy cards and up to 2 Basic [L] Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            }];
        this.set = 'SCR';
        this.regulationMark = 'H';
        this.setNumber = '50';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Joltik';
        this.fullName = 'Joltik SV7';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            //attach grass energy prompt
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, {
                allowCancel: true,
                min: 0,
                max: 4,
                differentTypes: true,
                validCardTypes: [card_types_1.CardType.GRASS, card_types_1.CardType.LIGHTNING],
                maxPerType: 2
            }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                // Shuffles deck after attaching both types of energies
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Joltik = Joltik;
