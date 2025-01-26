"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scizorex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Scizorex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.evolvesFrom = 'Scyther';
        this.cardType = M;
        this.hp = 270;
        this.weakness = [{ type: R }];
        this.resistance = [{ type: G, value: -30 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Steel Wing',
                cost: [C, C],
                damage: 70,
                text: 'During your opponent\'s next turn, this Pokémon takes 50 less damage from attacks (after applying Weakness and Resistance).'
            },
            {
                name: 'Cross Breaker',
                cost: [M, M],
                damage: 120,
                damageCalculation: 'x',
                text: 'Discard up to 2 [M] Energy from this Pokémon. This attack does 120 damage for each card you discarded in this way.'
            }];
        // for preventing the pokemon from attacking on the next turn
        this.STEEL_WING = 'STEEL_WING';
        this.CLEAR_STEEL_WING = 'CLEAR_STEEL_WING';
        this.set = 'TEF';
        this.name = 'Scizor ex';
        this.fullName = 'Scizor ex TEF';
        this.setNumber = '111';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Steel Wing
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.active.marker.addMarker(this.STEEL_WING, this);
            opponent.marker.addMarker(this.CLEAR_STEEL_WING, this);
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && effect.target.marker.hasMarker(this.STEEL_WING)) {
            effect.damage -= 50;
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_STEEL_WING, this)) {
            effect.player.marker.removeMarker(this.CLEAR_STEEL_WING, this);
            const opponent = game_1.StateUtils.getOpponent(state, effect.player);
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList) => {
                cardList.marker.removeMarker(this.STEEL_WING, this);
            });
        }
        // Cross Breaker
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.DiscardEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Metal Energy' }, { min: 0, max: 2, allowCancel: false }), transfers => {
                if (transfers === null) {
                    effect.damage = 0;
                    return;
                }
                if (transfers.length === 0) {
                    effect.damage = 0;
                    return state;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage = totalDiscarded * 120;
                }
                return state;
            });
        }
        return state;
    }
}
exports.Scizorex = Scizorex;
