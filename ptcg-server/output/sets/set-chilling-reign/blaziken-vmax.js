"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlazikenVMAX = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class BlazikenVMAX extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.POKEMON_VMAX, game_1.CardTag.RAPID_STRIKE];
        this.evolvesFrom = 'Blaziken V';
        this.cardType = game_1.CardType.FIRE;
        this.hp = 320;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'DEFENDING_POKEMON_CANNOT_RETREAT',
                cost: [game_1.CardType.FIRE],
                damage: 60,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            },
            {
                name: 'Max Blaze',
                cost: [C, C],
                damage: 130,
                text: 'Choose up to 2 of your Benched Rapid Strike Pokémon and attach an Energy card from your discard pile to each of them.'
            }
        ];
        this.set = 'CRE';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
        this.name = 'Blaziken VMAX';
        this.fullName = 'Blaziken VMAX CRE';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === game_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                return state;
            }
            let rapidStrikePokemonOnBench = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
                if (card.tags.includes(game_1.CardTag.RAPID_STRIKE)) {
                    rapidStrikePokemonOnBench = true;
                }
            });
            if (!rapidStrikePokemonOnBench) {
                return state;
            }
            const blocked2 = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (!card.tags.includes(game_1.CardTag.RAPID_STRIKE)) {
                    blocked2.push(target);
                }
            });
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 0, max: 2, blocked: blocked2 }), chosen => {
                chosen.forEach(target => {
                    state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC }, { allowCancel: true, min: 0, max: 1 }), transfers => {
                        transfers = transfers || [];
                        if (transfers.length === 0) {
                            return;
                        }
                        for (const transfer of transfers) {
                            const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                            player.discard.moveCardTo(transfer.card, target);
                        }
                    });
                });
            });
        }
        return state;
    }
}
exports.BlazikenVMAX = BlazikenVMAX;
