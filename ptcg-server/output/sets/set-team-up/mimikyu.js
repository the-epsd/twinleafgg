"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Mimikyu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [C];
        this.attacks = [{
                name: 'Filch',
                cost: [C],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Copycat',
                cost: [Y, C],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
            }];
        this.set = 'TEU';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu TEU';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            player.deck.moveTo(player.hand, 2);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const lastAttack = state.lastAttack;
            if (!lastAttack || lastAttack.copycatAttack === true || lastAttack.gxAttack === true) {
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
                    if (card instanceof game_1.PokemonCard && card.attacks.some(attack => attack === lastAttack)) {
                        originalCard = card;
                    }
                });
            });
        });
        return originalCard;
    }
}
exports.Mimikyu = Mimikyu;
