"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudowoodo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Sudowoodo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Watch and Learn',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If your opponent\'s Pokémon used an attack during his or her last turn, use it as this attack.'
            }];
        this.set = 'BKP';
        this.setNumber = '67';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sudowoodo';
        this.fullName = 'Sudowoodo BKP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const lastAttack = state.lastAttack;
            if (!lastAttack || lastAttack.name === 'Copycat' || lastAttack.name === 'Watch and Learn') {
                return state;
            }
            // Find the original card that used the last attack
            const originalCard = this.findOriginalCard(state, lastAttack);
            if (!originalCard) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [originalCard], { allowCancel: true, blocked: [] }), attack => {
                if (attack.name !== lastAttack.name) {
                    throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
                }
                if (attack !== null) {
                    state = this.executeCopiedAttack(store, state, player, opponent, attack);
                }
                return state;
            });
        }
        return state;
    }
    executeCopiedAttack(store, state, player, opponent, attack) {
        const copiedAttackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
        state = store.reduceEffect(state, copiedAttackEffect);
        if (copiedAttackEffect.damage > 0) {
            const dealDamage = new attack_effects_1.DealDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
            state = store.reduceEffect(state, dealDamage);
        }
        return state;
    }
    findOriginalCard(state, lastAttack) {
        let originalCard = null;
        state.players.forEach(player => {
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER && game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.attacks.some(attack => attack === lastAttack)) {
                    originalCard = card;
                }
            });
            // Check deck, discard, hand, and lost zone
            [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
                cardList.cards.forEach(card => {
                    if (card instanceof pokemon_card_1.PokemonCard && card.attacks.some(attack => attack === lastAttack)) {
                        originalCard = card;
                    }
                });
            });
        });
        return originalCard;
    }
}
exports.Sudowoodo = Sudowoodo;
