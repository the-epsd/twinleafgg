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
    const hasBench = player.bench.some(b => b.cards.length > 0);
    if (player.chainsOfControlUsed == true) {
        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
    }
    const blocked = [];
    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.name === 'Pecharunt ex') {
            blocked.push(target);
        }
        if (card.cardType !== card_types_1.CardType.DARK) {
            blocked.push(target);
        }
    });
    if (hasBench === false) {
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
                name: 'Chains of Control',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch 1 of your Benched D Pokémon (excluding Pecharunt ex) with your Active Pokémon. Your new Active Pokémon is now Poisoned. You can\'t use more than 1 Chains of Control Ability per turn.'
            }];
        this.attacks = [{
                name: 'Irritating Burst',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK],
                damage: 60,
                text: 'This attack does 60 damage for each Prize card your opponent has taken.'
            }];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Pecharunt ex';
        this.fullName = 'Pecharunt ex SV6a';
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
                    cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
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
                        console.log('Pecharunt ex is in play');
                    }
                });
            });
            return state;
        }
        return state;
    }
}
exports.Pecharuntex = Pecharuntex;
