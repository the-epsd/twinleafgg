"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegidragoVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useApexDragon(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const maxRetries = 3;
    const discardPokemon = player.discard.cards.filter(card => card.superType === card_types_1.SuperType.POKEMON);
    const dragonTypePokemon = discardPokemon.filter(card => card.cardType === card_types_1.CardType.DRAGON && card.name !== 'Regidrago VSTAR');
    if (dragonTypePokemon.length === 0) {
        return state;
    }
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
        let selected;
        yield store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, dragonTypePokemon, { allowCancel: true }), result => {
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
}
class RegidragoVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Regidrago V';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 280;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Apex Dragon',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Choose an attack from a [N] Pokémon in your discard pile and use it as this attack.'
            }
        ];
        this.powers = [
            {
                name: 'Legacy Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may discard the top 7 cards of your deck. Then, put up to 2 cards from your discard pile into your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
            }
        ];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '136';
        this.name = 'Regidrago VSTAR';
        this.fullName = 'Regidrago VSTAR SIT';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useApexDragon(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.usedVSTAR = true;
            player.deck.moveTo(player.discard, 7);
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 2, allowCancel: false }), selected => {
                cards = selected || [];
                cards.forEach((card, index) => {
                    player.discard.moveCardTo(card, player.hand);
                });
                if (cards.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => { });
                }
            });
        }
        return state;
    }
}
exports.RegidragoVSTAR = RegidragoVSTAR;
