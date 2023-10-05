"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArceusV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ArceusV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trinity Charge',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Search your deck for up to 3 basic Energy cards and ' +
                    'attach them to your Pokémon V in any way you like. Then, ' +
                    'shuffle your deck.'
            },
            {
                name: 'Power Edge',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }
        ];
        this.set = 'BRS';
        this.name = 'Arceus V';
        this.fullName = 'Arceus V BRS';
    }
    reduceEffect(store, state, effect) {
        // console.log('Store:', JSON.stringify(store, null, 2));
        // console.log('State:', JSON.stringify(state, null, 2));
        // console.log('Effect:', JSON.stringify(effect, null, 2));
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    if (!target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) &&
                        !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) &&
                        !target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                        throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
                    }
                    if (target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_V) ||
                        target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VSTAR) ||
                        target.cards[0].tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
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
exports.ArceusV = ArceusV;
