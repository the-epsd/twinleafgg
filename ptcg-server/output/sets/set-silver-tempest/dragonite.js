"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 160;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Dragon Claw',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            },
            {
                name: 'Energy Hurricane',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 180,
                text: 'Search your deck for up to 3 basic Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '131';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
            return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
