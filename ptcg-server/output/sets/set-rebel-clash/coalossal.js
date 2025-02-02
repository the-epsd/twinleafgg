"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coalossal = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Coalossal extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Carkol';
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Tar Generator',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a [R] Energy card, a [F] Energy card, or 1 of each from your discard pile to your Pokemon in any way you like.'
            }];
        this.attacks = [{
                name: 'Flaming Avalanche',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 130,
                text: ''
            }];
        this.set = 'RCL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '107';
        this.name = 'Coalossal';
        this.fullName = 'Coalossal RCL';
        this.TAR_GENERATOR_MARKER = 'TAR_GENERATOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && (c.provides.includes(card_types_1.CardType.FIGHTING) || c.provides.includes(card_types_1.CardType.FIRE));
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TAR_GENERATOR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_CARDS, player.discard, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: true, min: 1, max: 2, differentTypes: true, validCardTypes: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIRE] }), transfers => {
                transfers = transfers || [];
                for (const transfer of transfers) {
                    if (transfers.length > 1) {
                        if (transfers[0].card.name === transfers[1].card.name) {
                            throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                        }
                    }
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.discard.moveCardTo(transfer.card, target);
                }
                player.marker.addMarker(this.TAR_GENERATOR_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
        }
        return state;
    }
}
exports.Coalossal = Coalossal;
