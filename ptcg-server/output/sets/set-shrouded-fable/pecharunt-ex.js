"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pecharuntex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
function* useChainsOfControl(next, store, state, effect) {
    const player = effect.player;
    const hasDarkBench = player.bench.some(b => {
        var _a, _b;
        return ((_a = b.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) === card_types_1.CardType.DARK &&
            ((_b = b.getPokemonCard()) === null || _b === void 0 ? void 0 : _b.name) !== 'Pecharunt ex';
    });
    if (player.chainsOfControlUsed == true) {
        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
    }
    if (hasDarkBench === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        var _a;
        if (card.name === 'Pecharunt ex') {
            blocked.push(target);
        }
        if (((_a = list.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.cardType) !== card_types_1.CardType.DARK) {
            blocked.push(target);
        }
    });
    // Count Dark Pokemon in play
    let darkPokemonCount = 0;
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.cardType === card_types_1.CardType.DARK) {
            darkPokemonCount++;
        }
    });
    // Block ability if Pecharunt is the only Dark Pokemon
    if (darkPokemonCount <= 1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    let target = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, blocked }), results => {
        target = results || [];
        next();
    });
    if (target.length > 0) {
        player.active.clearEffects();
        player.switchPokemon(target[0]);
        player.active.addSpecialCondition(card_types_1.SpecialCondition.POISONED);
        player.chainsOfControlUsed = true;
    }
}
class Pecharuntex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Subjugating Chains',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch 1 of your Benched [D] Pokémon, except any Pecharunt ex, with your Active Pokémon. If you do, the new Active Pokémon is now Poisoned. You can\'t use more than 1 Subjugating Chains Ability each turn.'
            }];
        this.attacks = [{
                name: 'Irritated Outburst',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 60,
                damageCalculation: 'x',
                text: 'This attack does 60 damage for each Prize card your opponent has taken.'
            }];
        this.set = 'SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Pecharunt ex';
        this.fullName = 'Pecharunt ex SFA';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.chainsOfControlUsed = false;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useChainsOfControl(() => generator.next(), store, state, effect);
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 60;
            effect.damage = prizesTaken * damagePerPrize;
        }
        if (effect instanceof check_effects_1.CheckTableStateEffect) {
            state.players.forEach(player => {
                if (player.active.specialConditions.length === 0) {
                    return;
                }
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card === this) {
                        player.pecharuntexIsInPlay = true;
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.Pecharuntex = Pecharuntex;
