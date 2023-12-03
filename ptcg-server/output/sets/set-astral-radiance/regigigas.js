"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regigigas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Regigigas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Ancient Wisdom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if you have Regirock, Regice, Registeel, Regieleki, and Regidrago in play, you may attach up to 3 Energy cards from your discard pile to 1 of your Pokémon.'
            }];
        this.attacks = [{
                name: 'Gigaton Break',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 150 more damage.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.set2 = 'astralradiance';
        this.setNumber = '130';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas ASR';
        this.ANCIENT_WISDOM_MARKER = 'ANCIENT_WISDOM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            // Check if player has Regirock, Regice, Registeel, Regieleki, and Regidrago in play
            const player = effect.player;
            let hasRegirock = false;
            let hasRegice = false;
            let hasRegisteel = false;
            let hasRegieleki = false;
            let hasRegidrago = false;
            let hasRegis = false;
            if (!hasRegis) {
                game_1.GameMessage.CANNOT_USE_POWER;
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Regirock') {
                    hasRegirock = true;
                }
                if (card.name === 'Regice') {
                    hasRegice = true;
                }
                if (card.name === 'Registeel') {
                    hasRegisteel = true;
                }
                if (card.name === 'Regieleki') {
                    hasRegieleki = true;
                }
                if (card.name === 'Regidrago') {
                    hasRegidrago = true;
                }
                if (hasRegirock && hasRegice && hasRegisteel && hasRegieleki && hasRegidrago) {
                    hasRegis = true;
                }
                if (hasRegis) {
                    // Check if player has energy cards in discard pile
                    const hasEnergy = player.discard.cards.some(c => c instanceof game_1.EnergyCard);
                    if (!hasEnergy) {
                        return state;
                    }
                    if (player.marker.hasMarker(this.ANCIENT_WISDOM_MARKER, this)) {
                        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 0, max: 1, allowCancel: true }), chosen => {
                        chosen.forEach(target => {
                            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [chosen], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 0, max: 3 }), transfers => {
                                transfers = transfers || [];
                                // cancelled by user
                                if (transfers.length === 0) {
                                    return;
                                }
                                player.marker.addMarker(this.ANCIENT_WISDOM_MARKER, this);
                                for (const transfer of transfers) {
                                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                                    player.discard.moveCardTo(transfer.card, target);
                                }
                                return state;
                            });
                            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                                const player = effect.player;
                                const opponent = game_1.StateUtils.getOpponent(state, player);
                                const activePokemon = opponent.active.cards[0];
                                if (activePokemon && activePokemon.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                                    effect.damage += 150;
                                    return state;
                                }
                                if (effect instanceof game_phase_effects_1.EndTurnEffect) {
                                    effect.player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
                                }
                                return state;
                            }
                        });
                    });
                }
            });
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
