"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticunoGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ArticunoGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Legendary Ascent',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may switch it with your Active Pokémon. If you do, move any number of [W] Energy from your other Pokémon to this Pokémon. '
            }];
        this.attacks = [
            {
                name: 'Ice Wing',
                cost: [W, W, C],
                damage: 130,
                text: ''
            },
            {
                name: 'Cold Crush-GX',
                cost: [W],
                damage: 0,
                gxAttack: true,
                text: 'Discard all Energy from both Active Pokémon. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'CES';
        this.setNumber = '31';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Articuno-GX';
        this.fullName = 'Articuno-GX CES';
    }
    reduceEffect(store, state, effect) {
        // Legendary Ascent
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
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
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    let bench;
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                        if (card === this && target.slot === game_1.SlotType.BENCH) {
                            bench = cardList;
                        }
                    });
                    if (bench) {
                        player.switchPokemon(bench);
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
                        if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.name === 'Water Energy')) {
                            hasEnergyOnBench = true;
                        }
                    });
                    if (hasEnergyOnBench === false) {
                        return state;
                    }
                    return store.prompt(state, new game_1.MoveEnergyPrompt(effect.player.id, game_1.GameMessage.MOVE_ENERGY_TO_ACTIVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { superType: card_types_1.SuperType.ENERGY, name: 'Water Energy' }, { min: 1, allowCancel: false, blockedFrom, blockedTo }), result => {
                        const transfers = result || [];
                        transfers.forEach(transfer => {
                            const source = state_utils_1.StateUtils.getTarget(state, player, transfer.from);
                            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
                            source.moveCardTo(transfer.card, target);
                        });
                    });
                }
            });
        }
        // Cold Crush-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            const opponentEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent, opponent.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            state = store.reduceEffect(state, opponentEnergy);
            const cards = [];
            const oppCards = [];
            checkProvidedEnergy.energyMap.forEach(em => {
                cards.push(em.card);
            });
            opponentEnergy.energyMap.forEach(em => {
                oppCards.push(em.card);
            });
            const discardEnergy2 = new attack_effects_1.DiscardCardsEffect(effect, oppCards);
            discardEnergy2.target = opponent.active;
            store.reduceEffect(state, discardEnergy2);
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.ArticunoGX = ArticunoGX;
