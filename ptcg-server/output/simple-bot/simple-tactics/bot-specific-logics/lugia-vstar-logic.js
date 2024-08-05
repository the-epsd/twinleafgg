"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LugiaVStarTactic = void 0;
const game_1 = require("../../../game");
const simple_tactics_1 = require("../simple-tactics");
class LugiaVStarTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        let bestScore = 0;
        let bestAction;
        const lugiaVStarInPlay = player.bench.some(b => b.cards[0] instanceof game_1.PokemonCard && b.cards[0].name === 'Lugia VSTAR')
            || (player.active.cards[0] instanceof game_1.PokemonCard && player.active.cards[0].name === 'Lugia VSTAR');
        if (lugiaVStarInPlay) {
            bestScore += 5000;
        }
        const archeopsInDiscard = player.discard.cards.filter(c => c instanceof game_1.PokemonCard && c.name === 'Archeops').length;
        const emptyBenchSlots = player.bench.filter(b => b.cards.length === 0).length;
        if (lugiaVStarInPlay && archeopsInDiscard > 0 && emptyBenchSlots > 0) {
            const lugiaVStarIndex = player.bench.findIndex(b => b.cards[0] instanceof game_1.PokemonCard && b.cards[0].name === 'Lugia VSTAR');
            const lugiaVStarActive = player.active.cards[0] instanceof game_1.PokemonCard && player.active.cards[0].name === 'Lugia VSTAR';
            if (lugiaVStarActive || lugiaVStarIndex !== -1) {
                let ability;
                let target;
                if (lugiaVStarActive) {
                    ability = player.active.cards[0].powers.find(p => p.name === 'Summoning Star');
                    target = { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 };
                }
                else {
                    ability = player.bench[lugiaVStarIndex].cards[0].powers.find(p => p.name === 'Summoning Star');
                    target = { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: lugiaVStarIndex };
                }
                if (ability) {
                    const action = new game_1.UseAbilityAction(player.id, ability.name, target);
                    const score = 10000 + (archeopsInDiscard >= 2 ? 5000 : 0);
                    if (score > bestScore) {
                        bestScore = score;
                        bestAction = action;
                    }
                }
            }
        }
        if (!lugiaVStarInPlay) {
            if (archeopsInDiscard < 2 && state.turn <= 2) {
                const discardActions = [
                    this.discardWithUltraBall(player, 'Archeops'),
                    this.discardWithCarmine(player, 'Archeops'),
                    this.discardWithResearch(player, 'Archeops')
                ];
                const discardAction = discardActions.find(action => action !== undefined);
                if (discardAction) {
                    const score = this.evaluateAction(state, player.id, discardAction);
                    if (score !== undefined && score > bestScore) {
                        bestScore = score;
                        bestAction = discardAction;
                    }
                }
            }
            const lugiaVInPlay = player.bench.some(b => b.cards[0] instanceof game_1.PokemonCard && b.cards[0].name === 'Lugia V')
                || (player.active.cards[0] instanceof game_1.PokemonCard && player.active.cards[0].name === 'Lugia V');
            const lugiaVStarInHand = player.hand.cards.some(c => c instanceof game_1.PokemonCard && c.name === 'Lugia VSTAR');
            if (lugiaVInPlay && !lugiaVStarInHand) {
                const searchActions = [
                    this.searchWithUltraBall(player, ['Lugia VSTAR']),
                    this.searchWithGreatBall(player, ['Lugia VSTAR']),
                    this.searchWithMesagoza(player, ['Lugia VSTAR'])
                ];
                const searchAction = searchActions.find(action => action !== undefined);
                if (searchAction) {
                    const score = this.evaluateAction(state, player.id, searchAction);
                    if (score !== undefined && score > bestScore) {
                        bestScore = score;
                        bestAction = searchAction;
                    }
                }
            }
            else {
                const lugiaVInHand = player.hand.cards.findIndex(c => c instanceof game_1.PokemonCard && c.name === 'Lugia V');
                if (lugiaVInHand !== -1) {
                    const action = new game_1.PlayCardAction(player.id, lugiaVInHand, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.BENCH, index: 0 });
                    const score = this.evaluateAction(state, player.id, action);
                    if (score !== undefined && score > bestScore) {
                        bestScore = score;
                        bestAction = action;
                    }
                }
                const searchActions = [
                    this.searchWithUltraBall(player, ['Lugia V']),
                    this.searchWithGreatBall(player, ['Lugia V']),
                    this.searchWithMesagoza(player, ['Lugia V'])
                ];
                const searchAction = searchActions.find(action => action !== undefined);
                if (searchAction) {
                    const score = this.evaluateAction(state, player.id, searchAction);
                    if (score !== undefined && score > bestScore) {
                        bestScore = score;
                        bestAction = searchAction;
                    }
                }
            }
        }
        else {
            const searchActions = [
                this.searchWithUltraBall(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino']),
                this.searchWithGreatBall(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino']),
                this.searchWithMesagoza(player, ['Archeops', 'Lugia V', 'Lugia VSTAR', 'Minccino', 'Cinccino'])
            ];
            const searchAction = searchActions.find(action => action !== undefined);
            if (searchAction) {
                const score = this.evaluateAction(state, player.id, searchAction);
                if (score !== undefined && score > bestScore) {
                    bestScore = score;
                    bestAction = searchAction;
                }
            }
        }
        return bestAction;
    }
    discardWithUltraBall(player, cardName) {
        const ultraBallIndex = player.hand.cards.findIndex(c => c.name === 'Ultra Ball');
        if (ultraBallIndex !== -1) {
            const targetCardIndex = player.hand.cards.findIndex(c => c instanceof game_1.PokemonCard && c.name === cardName);
            if (targetCardIndex !== -1) {
                const otherCardIndex = player.hand.cards.findIndex((c, i) => i !== targetCardIndex && i !== ultraBallIndex);
                if (otherCardIndex !== -1) {
                    return new game_1.PlayCardAction(player.id, ultraBallIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.HAND, index: 0 });
                }
            }
        }
        return undefined;
    }
    discardWithCarmine(player, cardName) {
        const carmineIndex = player.hand.cards.findIndex(c => c.name === 'Carmine');
        if (carmineIndex !== -1) {
            const targetCardIndex = player.hand.cards.findIndex(c => c instanceof game_1.PokemonCard && c.name === cardName);
            if (targetCardIndex !== -1) {
                return new game_1.PlayCardAction(player.id, carmineIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.HAND, index: 0 });
            }
        }
        return undefined;
    }
    discardWithResearch(player, cardName) {
        const researchIndex = player.hand.cards.findIndex(c => c.name === 'Professor\'s Research');
        if (researchIndex !== -1) {
            const targetCardIndex = player.hand.cards.findIndex(c => c instanceof game_1.PokemonCard && c.name === cardName);
            if (targetCardIndex !== -1) {
                return new game_1.PlayCardAction(player.id, researchIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.HAND, index: 0 });
            }
        }
        return undefined;
    }
    searchWithUltraBall(player, cardNames) {
        const ultraBallIndex = player.hand.cards.findIndex(c => c.name === 'Ultra Ball');
        if (ultraBallIndex !== -1) {
            const discardableCards = player.hand.cards.filter((c, i) => i !== ultraBallIndex).slice(0, 2);
            if (discardableCards.length === 2) {
                return new game_1.PlayCardAction(player.id, ultraBallIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.HAND, index: 0 });
            }
        }
        return undefined;
    }
    searchWithGreatBall(player, cardNames) {
        const greatBallIndex = player.hand.cards.findIndex(c => c.name === 'Great Ball');
        if (greatBallIndex !== -1) {
            return new game_1.PlayCardAction(player.id, greatBallIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.HAND, index: 0 });
        }
        return undefined;
    }
    searchWithMesagoza(player, cardNames) {
        const mesagozaIndex = player.hand.cards.findIndex(c => c.name === 'Mesagoza');
        if (mesagozaIndex !== -1) {
            return new game_1.PlayCardAction(player.id, mesagozaIndex, { player: game_1.PlayerType.BOTTOM_PLAYER, slot: game_1.SlotType.ACTIVE, index: 0 });
        }
        return undefined;
    }
}
exports.LugiaVStarTactic = LugiaVStarTactic;
