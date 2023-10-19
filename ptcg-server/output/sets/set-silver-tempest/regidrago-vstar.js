"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegidragoVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useCrossFusionStrike(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const discardPokemon = player.discard.cards
        .filter(card => card.superType === card_types_1.SuperType.POKEMON);
    const fusionStrike = discardPokemon.filter(card => card.tags.includes(card_types_1.CardTag.FUSION_STRIKE));
    let selected;
    yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, discardPokemon && fusionStrike, { allowCancel: false }), result => {
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
class RegidragoVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.BASIC;
        //   public evolvesFrom = 'Regidrago V';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 280;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Apex Dragon',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose an attack from a [N] Pokémon in your discard pile and use it as this attack.'
            }];
        this.set = 'FST';
        this.set2 = 'fusionstrike';
        this.setNumber = '114';
        this.name = 'Regidrago VSTAR';
        this.fullName = 'Regidrago VSTAR FST 114';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useCrossFusionStrike(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.RegidragoVSTAR = RegidragoVSTAR;
