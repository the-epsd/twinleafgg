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
                damageCalculator: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon VMAX, this attack does 150 more damage.'
            }];
        this.regulationMark = 'F';
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Regigigas';
        this.fullName = 'Regigigas ASR';
        this.ANCIENT_WISDOM_MARKER = 'ANCIENT_WISDOM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ANCIENT_WISDOM_MARKER, this)) {
            effect.player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ANCIENT_WISDOM_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            // Check if player has Regirock, Regice, Registeel, Regieleki, and Regidrago in play
            const player = effect.player;
            let hasRegis = false;
            let regis = ['Regirock', 'Regice', 'Registeel', 'Regieleki', 'Regidrago'];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (regis.includes(card.name)) {
                    regis = regis.filter(r => r !== card.name);
                }
            });
            if (regis.length === 0) {
                hasRegis = true;
            }
            if (!hasRegis) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (hasRegis) {
                // Check if player has energy cards in discard pile
                const hasEnergy = player.discard.cards.some(c => c instanceof game_1.EnergyCard);
                if (!hasEnergy) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                }
                if (player.marker.hasMarker(this.ANCIENT_WISDOM_MARKER, this)) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 3, sameTarget: true }), transfers => {
                    transfers = transfers || [];
                    // cancelled by user
                    if (transfers.length === 0) {
                        return;
                    }
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.discard.moveCardTo(transfer.card, target);
                        player.marker.addMarker(this.ANCIENT_WISDOM_MARKER, this);
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                            if (cardList.getPokemonCard() === this) {
                                cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                            }
                        });
                    }
                });
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard && pokemonCard.tags.includes(card_types_1.CardTag.POKEMON_VMAX)) {
                effect.damage += 150;
            }
        }
        return state;
    }
}
exports.Regigigas = Regigigas;
