"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mimikyu = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Mimikyu extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.cardType = game_1.CardType.PSYCHIC;
        this.hp = 70;
        this.weakness = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Filch',
                cost: [game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Draw 2 cards.'
            }, {
                name: 'Copycat',
                cost: [game_1.CardType.PSYCHIC, game_1.CardType.COLORLESS],
                damage: 0,
                copycatAttack: true,
                text: 'If your opponent\'s Pokémon used an attack that isn\'t a GX attack during their last turn, use it as this attack.'
            }];
        this.set = 'GRI';
        this.name = 'Mimikyu';
        this.fullName = 'Mimikyu GRI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.copiedReduceEffect = null;
        this.copiedProperties = null;
    }
    reduceEffect(store, state, effect) {
        // If we have a copied reduceEffect and this is an AttackEffect, use it
        if (this.copiedReduceEffect && effect instanceof game_effects_1.AttackEffect) {
            console.log('Using copied reduceEffect for attack:', effect.attack.name);
            return this.copiedReduceEffect(store, state, effect);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            // Only clear the copied reduceEffect when it's our turn ending
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            if (owner === effect.player) {
                console.log('Clearing copied reduceEffect and properties for Mimikyu');
                this.copiedReduceEffect = null;
                this.copiedProperties = null;
            }
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
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
            console.log('Copying properties from card:', originalCard.name);
            // Copy all properties from the original card
            this.copiedProperties = {};
            Object.getOwnPropertyNames(originalCard).forEach(prop => {
                if (prop !== 'reduceEffect' && typeof originalCard[prop] !== 'function') {
                    this.copiedProperties[prop] = originalCard[prop];
                    console.log('Copied property:', prop, '=', originalCard[prop]);
                }
            });
            // Copy the original card's reduceEffect
            this.copiedReduceEffect = originalCard.reduceEffect.bind(originalCard);
            console.log('Copied reduceEffect from:', originalCard.name);
            // Directly execute the copied attack without UI prompt
            return this.executeCopiedAttack(store, state, player, opponent, lastAttack);
        }
        return state;
    }
    executeCopiedAttack(store, state, player, opponent, attack) {
        // Create a new attack effect using the attack
        const copiedAttackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
        copiedAttackEffect.source = player.active;
        copiedAttackEffect.target = opponent.active;
        // If we have copied properties, apply them to the effect
        if (this.copiedProperties) {
            Object.assign(copiedAttackEffect, this.copiedProperties);
            console.log('Applied copied properties to attack effect:', this.copiedProperties);
        }
        // Execute the attack
        state = store.reduceEffect(state, copiedAttackEffect);
        if (copiedAttackEffect.attack.shredAttack === true && copiedAttackEffect.damage > 0) {
            // Apply damage and trigger AfterDamageEffect
            opponent.active.damage += copiedAttackEffect.damage;
            const afterDamage = new attack_effects_1.AfterDamageEffect(copiedAttackEffect, copiedAttackEffect.damage);
            state = store.reduceEffect(state, afterDamage);
        }
        if (copiedAttackEffect.attack.shredAttack !== true && copiedAttackEffect.damage > 0) {
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
