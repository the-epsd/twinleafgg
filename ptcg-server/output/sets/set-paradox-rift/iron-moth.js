"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronMoth = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class IronMoth extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.FIRE;
        this.hp = 130;
        this.weakness = [{ type: game_1.CardType.WATER }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.tags = [game_1.CardTag.FUTURE];
        this.powers = [{
                name: 'Thermal Reactor',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may move any amount of [R] Energy from your other Pokémon to it.'
            }];
        this.attacks = [{
                name: 'Heat Ray',
                cost: [game_1.CardType.FIRE, game_1.CardType.FIRE, game_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Heat Ray.'
            }];
        this.regulationMark = 'G';
        this.set = 'PAR';
        this.name = 'Iron Moth';
        this.fullName = 'Iron Moth PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '28';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
        this.ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = state.players[state.activePlayer];
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
            this.movedToActiveThisTurn = false;
        }
        const cardList = game_1.StateUtils.findCardList(state, this);
        const owner = game_1.StateUtils.findOwner(state, cardList);
        const player = state.players[state.activePlayer];
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
        }
        if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
            if (this.movedToActiveThisTurn == true) {
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.ABILITY,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                const blockedFrom = [];
                const blockedTo = [];
                let hasEnergyOnBench = false;
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                    if (cardList === player.active) {
                        blockedFrom.push(target);
                        return;
                    }
                    blockedTo.push(target);
                    if (cardList.cards.some(c => c instanceof game_1.EnergyCard)) {
                        hasEnergyOnBench = true;
                    }
                });
                if (hasEnergyOnBench === false) {
                    return state;
                }
                return store.prompt(state, new game_1.MoveEnergyPrompt(player.id, game_1.GameMessage.MOVE_ENERGY_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], // Only allow moving to active
                { superType: game_1.SuperType.ENERGY, energyType: game_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: true, blockedTo: blockedTo, blockedFrom: blockedFrom }), transfers => {
                    if (!transfers) {
                        return;
                    }
                    for (const transfer of transfers) {
                        // Can only move energy to the active Pokemon
                        const target = player.active;
                        const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                        transfers.forEach(transfer => {
                            source.moveCardTo(transfer.card, target);
                            return state;
                        });
                    }
                    player.marker.addMarker(this.ABILITY_USED_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(game_1.BoardEffect.ABILITY_USED);
                        }
                    });
                });
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
    }
}
exports.IronMoth = IronMoth;
