"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Solrock = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Solrock extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Sun Energy',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may attach a P Energy card from your discard pile to 1 of your Lunatone.'
            }];
        this.attacks = [
            {
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'PGO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Solrock';
        this.fullName = 'Solrock PGO';
        this.SUN_ENERGY_MARKER = 'SUN_ENERGY_MARKER';
    }
    // BEGIN: abpxx6d04wxr
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && c.provides.includes(card_types_1.CardType.PSYCHIC);
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SUN_ENERGY_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.bench.forEach((card, index) => {
                if (!(card instanceof pokemon_card_1.PokemonCard && card.name === 'Lunatone')) {
                    blocked.push(index);
                }
            });
            player.active.cards.forEach((card, index) => {
                if (!(card instanceof pokemon_card_1.PokemonCard && card.name === 'Lunatone')) {
                    blocked.push(index);
                }
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { allowCancel: true, min: 1, max: 1, blocked: blocked }), transfers => {
                transfers = transfers || [];
                // cancelled by user
                if (transfers.length === 0) {
                    return;
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    // if (target.getPokemonCard()?.name !== 'Lunatone') {
                    //   throw new GameError(GameMessage.INVALID_TARGET);
                    // }
                    player.discard.moveCardTo(transfer.card, target);
                    player.marker.addMarker(this.SUN_ENERGY_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                }
            });
            // END: abpxx6d04wxr
            // BEGIN: ed8c6549bwf9
            if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                effect.player.marker.removeMarker(this.SUN_ENERGY_MARKER, this);
            }
            return state;
            // END: ed8c6549bwf9
        }
        return state;
    }
}
exports.Solrock = Solrock;
