"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafeonV = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class LeafeonV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.GRASS;
        this.hp = 200;
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.retreat = [game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.POKEMON_V];
        this.powers = [{
                name: 'Greening Cells',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may search your deck for a [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck. If you use this Ability, your turn ends.'
            }];
        this.attacks = [{
                name: 'Leaf Blade',
                cost: [game_1.CardType.GRASS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 90,
                text: 'Flip a coin. If heads, this attack does 60 more damage.'
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '7';
        this.name = 'Leafeon V';
        this.fullName = 'Leafeon V EVS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Grass Energy' }, { allowCancel: true, min: 0, max: 1 }), transfers => {
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
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 60;
                }
            });
        }
        return state;
    }
}
exports.LeafeonV = LeafeonV;
