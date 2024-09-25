"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefairy = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useMetronome(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const pokemonCard = opponent.active.getPokemonCard();
    if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], { allowCancel: false }), result => {
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
class Clefairy extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'D';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Pound',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            },
            {
                name: 'Mini-Metronome',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, choose 1 of your opponent\'s Active Pokémon\'s attacks and use it as this attack.'
            }
        ];
        this.set = 'VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '63';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy VIV';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    const generator = useMetronome(() => generator.next(), store, state, effect);
                    return generator.next().value;
                }
            });
        }
        return state;
    }
}
exports.Clefairy = Clefairy;
