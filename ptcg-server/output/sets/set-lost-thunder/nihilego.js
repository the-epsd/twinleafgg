"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nihilego = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useNightcap(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const opponentBenchedPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined);
    const opponentActivePokemon = [];
    if (opponent.active.getPokemonCard() != undefined) {
        opponentActivePokemon.push(opponent.active.getPokemonCard());
    }
    const opponentPokemon = [];
    opponentPokemon.push(...opponentActivePokemon);
    opponentPokemon.push(...opponentBenchedPokemon);
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, opponentPokemon, { allowCancel: false }), result => {
        selected = result;
        next();
    });
    const attack = selected;
    if (attack === null) {
        return state;
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
        name: player.name,
        attack: attack.name
    });
    // Perform attack
    const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
    store.reduceEffect(state, attackEffect);
    if (store.hasPrompts()) {
        yield store.waitPrompt(state, () => next());
    }
    if (attackEffect.damage > 0) {
        const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
        state = store.reduceEffect(state, dealDamage);
    }
    return state;
}
class Nihilego extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 110;
        this.tag = [card_types_1.CardTag.ULTRA_BEAST];
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Nightcap',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'You can use this attack only if your opponent has exactly 2 Prize cards remaining. Choose 1 of your opponent\'s Pokemon\'s attacks and use it as this attack.'
            },
            {
                name: 'Void Tentacles',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Your opponent\'s Active Pokémon is now Confused and Poisoned.'
            },
        ];
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Nihilego';
        this.fullName = 'Nihilego LOT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() !== 2) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            if (opponent.getPrizeLeft() === 2) {
                const generator = useNightcap(() => generator.next(), store, state, effect);
                return generator.next().value;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.CONFUSED, card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        return state;
    }
}
exports.Nihilego = Nihilego;
