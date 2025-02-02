"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scyther = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Scyther extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Helpful Slash',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'Attach a Basic [G] Energy card from your discard pile to 1 of your Benched Pokémon.'
            },
            {
                name: 'Slicing Blade',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'MEW';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Scyther';
        this.fullName = 'Scyther MEW';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            const hasBasicEnergy = player.active.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC && c.provides.includes(card_types_1.CardType.GRASS);
            });
            if (hasBench === false || hasBasicEnergy === false) {
                return state;
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: false, min: 1, max: 1 }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.active.moveCardTo(transfer.card, target);
                }
            });
        }
        return state;
    }
}
exports.Scyther = Scyther;
