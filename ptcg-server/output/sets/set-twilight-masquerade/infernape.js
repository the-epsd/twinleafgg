"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Infernape = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Infernape extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Monferno';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Pyro Dance',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may attach a Basic [R] Energy card, a Basic [F] Energy card, or 1 of each from your hand to your Pokémon in any way you like.'
            }];
        this.attacks = [{
                name: 'Scorching Fire',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '33';
        this.name = 'Infernape';
        this.fullName = 'Infernape TWM';
        this.TAR_GENERATOR_MARKER = 'TAR_GENERATOR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.TAR_GENERATOR_MARKER, this);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.COLORLESS, 1);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasEnergyInDiscard = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC
                    && (c.provides.includes(card_types_1.CardType.FIGHTING) || (c.provides.includes(card_types_1.CardType.FIRE)));
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.TAR_GENERATOR_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                checkProvidedEnergy.energyMap.forEach((em, index) => {
                    if (!(em.provides.includes(card_types_1.CardType.FIGHTING) || em.provides.includes(card_types_1.CardType.FIRE)) || em.provides.includes(card_types_1.CardType.ANY)) {
                        const globalIndex = cardList.cards.indexOf(em.card);
                        if (globalIndex !== -1 && !blocked.includes(globalIndex)) {
                            blocked.push(globalIndex);
                        }
                    }
                });
            });
            state = store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.hand, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, {
                allowCancel: true,
                min: 1,
                max: 2,
                blocked,
                differentTypes: true,
                validCardTypes: [card_types_1.CardType.FIRE, card_types_1.CardType.FIGHTING]
            }), transfers => {
                transfers = transfers || [];
                player.marker.addMarker(this.TAR_GENERATOR_MARKER, this);
                if (transfers.length === 0) {
                    return state;
                }
                if (transfers.length > 1) {
                    if (transfers[0].card.name === transfers[1].card.name) {
                        throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
                    }
                }
                for (const transfer of transfers) {
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    player.hand.moveCardTo(transfer.card, target);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                }
            });
        }
        return state;
    }
}
exports.Infernape = Infernape;
