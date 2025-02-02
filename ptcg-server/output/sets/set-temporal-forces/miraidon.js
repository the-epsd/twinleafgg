"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Miraidon = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const card_types_2 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
class Miraidon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_2.CardTag.FUTURE];
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 110;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Peak Acceleration',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 40,
                text: 'Search your deck for up to 2 Basic Energy cards and attach them to your Future Pokémon in any way you like. Then, shuffle your deck.'
            },
            {
                name: 'Sparking Strike',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING, card_types_1.CardType.PSYCHIC],
                damage: 160,
                text: ''
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.name = 'Miraidon';
        this.fullName = 'Miraidon TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false, min: 0, max: 2 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (!target.cards[0].tags.includes(card_types_2.CardTag.FUTURE)) {
                        throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                    }
                    if (target.cards[0].tags.includes(card_types_2.CardTag.FUTURE)) {
                        player.deck.moveCardTo(transfer.card, target);
                    }
                }
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Miraidon = Miraidon;
