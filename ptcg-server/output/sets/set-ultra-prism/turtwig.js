"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Turtwig = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Turtwig extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.hp = 70;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Synthesis',
                cost: [G],
                damage: 0,
                text: 'Search your deck for a [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck.'
            },
            {
                name: 'Headbutt Bounce',
                cost: [G, C],
                damage: 30,
                text: ''
            }
        ];
        this.set = 'UPR';
        this.setNumber = '6';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Turtwig';
        this.fullName = 'Turtwig UPR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.deck.moveCardTo(transfer.card, target);
                }
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Turtwig = Turtwig;
