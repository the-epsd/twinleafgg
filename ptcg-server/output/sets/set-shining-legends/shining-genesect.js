"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiningGenesect = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ShiningGenesect extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Energy Reload',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may move a [G] Energy from 1 of your other Pokémon to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Gaia Blaster',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 50,
                text: 'This attack does 20 more damage times the amount of [G] Energy attached to this Pokémon.'
            },
        ];
        this.set = 'SLG';
        this.name = 'Shining Genesect';
        this.fullName = 'Shining Genesect SLG';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '9';
        this.ENERGY_RELOAD_MARKER = 'ENERGY_RELOAD_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ENERGY_RELOAD_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ENERGY_RELOAD_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            let pokemonCount = 0;
            let otherPokemonWithEnergy = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card !== this) {
                    pokemonCount += 1;
                    const hasAttachedEnergy = cardList.cards.some(c => c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.GRASS || c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.ANY)));
                    otherPokemonWithEnergy = otherPokemonWithEnergy || hasAttachedEnergy;
                }
            });
            if (pokemonCount <= 1 && !otherPokemonWithEnergy) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const blockedMap = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergy);
                const blockedCards = [];
                checkProvidedEnergy.energyMap.forEach(em => {
                    if (!em.provides.includes(card_types_1.CardType.GRASS) && !em.provides.includes(card_types_1.CardType.ANY)) {
                        blockedCards.push(em.card);
                    }
                });
                const blocked = [];
                blockedCards.forEach(bc => {
                    const index = cardList.cards.indexOf(bc);
                    if (index !== -1 && !blocked.includes(index)) {
                        blocked.push(index);
                    }
                });
                if (blocked.length !== 0) {
                    blockedMap.push({ source: target, blocked });
                }
            });
            const blockedFrom = [];
            const blockedTo = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.getPokemonCard() !== this) {
                    blockedTo.push(target);
                }
                else {
                    blockedFrom.push(target);
                }
            });
            return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_message_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false, blockedMap, blockedFrom, blockedTo }), transfers => {
                if (transfers === null) {
                    return;
                }
                player.marker.addMarker(this.ENERGY_RELOAD_MARKER, this);
                for (const transfer of transfers) {
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                    source.moveCardTo(transfer.card, target);
                }
                return state;
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.ENERGY_RELOAD_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            // Count total FIRE energy provided
            const totalGrassEnergy = checkEnergy.energyMap.reduce((sum, energy) => {
                return sum + energy.provides.filter(type => type === card_types_1.CardType.GRASS || type === card_types_1.CardType.ANY).length;
            }, 0);
            effect.damage += totalGrassEnergy * 20;
        }
        return state;
    }
}
exports.ShiningGenesect = ShiningGenesect;
