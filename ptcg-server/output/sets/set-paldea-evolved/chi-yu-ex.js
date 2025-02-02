"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChiYuex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class ChiYuex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Jealousy Singe',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Discard the top 2 cards of your opponent\'s deck.'
            },
            {
                name: 'Flame Surge',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 100,
                text: 'Choose up to 3 of your Benched Pokémon. For each of those Pokémon, search your deck for a Basic [R] Energy card and attach it to that Pokémon. Then, shuffle your deck.'
            },
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Chi-Yu ex';
        this.fullName = 'Chi-Yu ex PAL';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Discard 1 card from opponent's deck 
            opponent.deck.moveTo(opponent.discard, 2);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_message_1.GameMessage.ATTACH_ENERGY_TO_ACTIVE, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 0, max: 3, differentTargets: true }), transfers => {
                transfers = transfers || [];
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.ChiYuex = ChiYuex;
