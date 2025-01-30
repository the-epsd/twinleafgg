"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TogepiCleffaIgglybuffGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class TogepiCleffaIgglybuffGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.TAG_TEAM];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 240;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Rolling Panic',
                cost: [Y, Y, C],
                damage: 120,
                damageCalculation: '+',
                text: 'Flip a coin until you get tails. This attack does 30 more damage for each heads.'
            },
            {
                name: 'Supreme Puff-GX',
                cost: [Y, Y],
                damage: 0,
                gxAttack: true,
                text: 'Take another turn after this one. (Skip the between-turns step.) If this Pokémon has at least 14 extra [Y] Energy attached to it (in addition to this attack\'s cost), your opponent shuffles all of their Benched Pokémon and all cards attached to them into their deck. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CEC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '143';
        this.name = 'Togepi & Cleffa & Igglybuff-GX';
        this.fullName = 'Togepi & Cleffa & Igglybuff-GX CEC';
        this.SUPREME_PUFF_MARKER = 'SUPREME_PUFF_MARKER';
        this.SUPREME_PUFF_MARKER_2 = 'SUPREME_PUFF_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // turn skipping shenanegains (thanks for dialga-gx)
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SUPREME_PUFF_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.SUPREME_PUFF_MARKER, this);
            effect.player.marker.removeMarker(this.SUPREME_PUFF_MARKER_2, this);
            effect.player.usedTurnSkip = false;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SUPREME_PUFF_MARKER, this)) {
            effect.player.marker.addMarker(this.SUPREME_PUFF_MARKER_2, this);
        }
        // Rolling Panic
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let heads = 0;
            store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    heads++;
                    return this.reduceEffect(store, state, effect);
                }
            });
            effect.damage += heads * 30;
        }
        // Supreme Puff-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.usedGX === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            player.usedGX = true;
            player.marker.addMarker(this.SUPREME_PUFF_MARKER, this);
            effect.player.usedTurnSkip = true;
            // Check for the extra energy cost.
            const extraEffectCost = [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y];
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, checkProvidedEnergy);
            const meetsExtraEffectCost = game_1.StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);
            if (!meetsExtraEffectCost) {
                return state;
            } // If we don't have the extra energy, we just deal damage.
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card !== opponent.active.getPokemonCard()) {
                    cardList.moveTo(opponent.deck);
                }
            });
            store.prompt(state, new game_1.ShuffleDeckPrompt(opponent.id), order => {
                opponent.deck.applyOrder(order);
            });
        }
        return state;
    }
}
exports.TogepiCleffaIgglybuffGX = TogepiCleffaIgglybuffGX;
