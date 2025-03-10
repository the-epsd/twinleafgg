"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minun = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const state_1 = require("../../game/store/state/state");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Minun extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING, value: +10 }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Minus Charge',
                powerType: game_1.PowerType.POKEPOWER,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), if any Pokémon were Knocked Out during your opponent\’s last turn, you may draw 2 cards. You can\’t use more than 1 Minus Charge Poké-Power each turn. This power can\’t be used if Minun is affected by a Special Condition.'
            }];
        this.attacks = [{
                name: 'Tag Play',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: 'If you have Plusle on your Bench, you may move an Energy card attached to Minun to 1 of your Benched Pokémon.'
            }];
        this.set = 'SW';
        this.setNumber = '32';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Minun';
        this.fullName = 'Minun SW';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            if (!prefabs_1.HAS_MARKER('OPPONENT_KNOCKOUT_MARKER', player, this)) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.usedMinusCharge == true) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.deck.moveTo(player.hand, 2);
            player.usedMinusCharge = true;
            prefabs_1.ABILITY_USED(player, this);
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== state_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                prefabs_1.ADD_MARKER('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === player) {
                prefabs_1.REMOVE_MARKER('OPPONENT_KNOCKOUT_MARKER', player, this);
            }
            player.usedMinusCharge = false;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let isPlusleInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.name === 'Plusle') {
                    isPlusleInPlay = true;
                }
            });
            if (isPlusleInPlay) {
                const player = effect.player;
                const hasBench = player.bench.some(b => b.cards.length > 0);
                if (hasBench === false) {
                    return state;
                }
                // Then prompt for energy movement
                return store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.active, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY }, { allowCancel: false, min: 0, max: 1 }), transfers => {
                    transfers = transfers || [];
                    for (const transfer of transfers) {
                        const target = game_1.StateUtils.getTarget(state, player, transfer.to);
                        player.active.moveCardTo(transfer.card, target);
                    }
                });
            }
            return state;
        }
        return state;
    }
}
exports.Minun = Minun;
