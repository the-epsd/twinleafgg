"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StonjournerVMAX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class StonjournerVMAX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VMAX;
        this.evolvesFrom = 'Stonjourner V';
        this.tags = [card_types_1.CardTag.POKEMON_VMAX];
        this.cardType = F;
        this.hp = 330;
        this.weakness = [{ type: G }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Stone Gift',
                cost: [F],
                damage: 0,
                text: 'Attach a [F] Energy card from your hand to 1 of your Pokémon. If you do, heal 120 damage from that Pokémon.'
            },
            {
                name: 'Max Rockfall',
                cost: [F, F, F],
                damage: 200,
                text: ''
            },
        ];
        this.set = 'SSH';
        this.regulationMark = 'D';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '116';
        this.name = 'Stonjourner VMAX';
        this.fullName = 'Stonjourner VMAX SSH';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { allowCancel: true, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return state;
                }
                for (const transfer of transfers) {
                    //Attaching energy
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                    //Heal 30 from target
                    const healEffect = new game_effects_1.HealEffect(player, target, 120);
                    state = store.reduceEffect(state, healEffect);
                }
            });
        }
        return state;
    }
}
exports.StonjournerVMAX = StonjournerVMAX;
