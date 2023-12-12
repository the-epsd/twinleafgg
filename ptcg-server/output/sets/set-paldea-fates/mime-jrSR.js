"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MimeJrSR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useMakeBelieveCopycat(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const activePokemonCard = opponent.active.getPokemonCard();
    const benchPokemonCard = opponent.bench.forEach(b => b.getPokemonCard());
    if (activePokemonCard === undefined || activePokemonCard.attacks.length === 0) {
        return state;
    }
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(opponent.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [activePokemonCard || benchPokemonCard], { allowCancel: false }), result => {
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
class MimeJrSR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [];
        this.attacks = [{
                name: 'Make Believe Copycat',
                cost: [],
                damage: 0,
                text: 'Your opponent chooses 1 of their Pokémon\'s attacks. Use that attack as this attack.'
            }];
        this.set = 'SV4';
        this.set2 = 'shinytreasureex';
        this.setNumber = '262';
        this.name = 'Mime Jr.';
        this.fullName = 'Mime Jr.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useMakeBelieveCopycat(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.MimeJrSR = MimeJrSR;
