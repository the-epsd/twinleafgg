"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clefairy = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useMetronome(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const pokemonCard = opponent.active.getPokemonCard();
    let retryCount = 0;
    const maxRetries = 3;
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
        return state; // Player chose to cancel
    }
    try {
        store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
            name: player.name,
            attack: attack.name
        });
        const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
        state = store.reduceEffect(state, attackEffect);
        if (store.hasPrompts()) {
            yield store.waitPrompt(state, () => next());
        }
        if (attackEffect.damage > 0) {
            const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
        }
        return state; // Successfully executed attack, exit the function
    }
    catch (error) {
        console.log('Attack failed:', error);
        retryCount++;
        if (retryCount >= maxRetries) {
            console.log('Max retries reached. Exiting loop.');
            return state;
        }
    }
}
class Clefairy extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 40;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Sing',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
            },
            {
                name: 'Metronome',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose 1 of the Defending Pokémon\'s attacks. Metronome copies that attack except for its Energy costs and anything else required in order to use that attack, such as discarding Energy cards. (No matter what type the Defending Pokémon is, Clefairy\'s type is still Colorless.)'
            },
        ];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '5';
        this.name = 'Clefairy';
        this.fullName = 'Clefairy BS';
        this.REDUCE_DAMAGE_MARKER = 'REDUCE_DAMAGE_MARKER';
        this.CLEAR_REDUCE_DAMAGE_MARKER = 'CLEAR_REDUCE_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP)) {
                return state;
            }
            state = store.prompt(state, new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP), result => {
                if (result) {
                    opponent.active.addSpecialCondition(card_types_1.SpecialCondition.ASLEEP);
                }
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const generator = useMetronome(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Clefairy = Clefairy;
