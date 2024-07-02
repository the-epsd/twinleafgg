"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bunnelby = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const state_utils_1 = require("../../game/store/state-utils");
class Bunnelby extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Barrage',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Burrow',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard the top card of your opponent\'s deck.'
            }, {
                name: 'Rototiller',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Shuffle a card from your discard pile into your deck.'
            }];
        this.set = 'PRC';
        this.name = 'Bunnelby';
        this.fullName = 'Bunnelby PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '121';
        this.attacksThisTurn = 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.attacksThisTurn = 0;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack !== this.attacks[0] &&
            effect.attack !== this.attacks[1] && effect.player.active.cards.includes(this)) {
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            opponent.deck.moveTo(opponent.discard, 1);
            this.attacksThisTurn += 1;
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [player.active.getPokemonCard()], { allowCancel: false }), result => {
                        selected = result;
                        const attack = selected;
                        if (attack !== null) {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
                                name: player.name,
                                attack: attack.name
                            });
                            // Perform attack
                            const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
                            store.reduceEffect(state, attackEffect);
                            if (store.hasPrompts()) {
                                store.waitPrompt(state, () => { });
                            }
                            if (attackEffect.damage > 0) {
                                const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                                state = store.reduceEffect(state, dealDamage);
                            }
                        }
                        return state;
                    });
                }
                ;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, effect.player);
            if (player.discard.cards.length === 0) {
                this.attacksThisTurn += 1;
            }
            else {
                state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                    const cards = selected || [];
                    this.attacksThisTurn += 1;
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        player.discard.moveCardsTo(cards, player.deck);
                    });
                    cards.forEach(card => {
                        store.log(state, game_message_1.GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
                    });
                    store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            }
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_message_1.GameMessage.CHOOSE_ATTACK_TO_COPY, [player.active.getPokemonCard()], { allowCancel: false }), result => {
                        selected = result;
                        const attack = selected;
                        if (attack !== null) {
                            store.log(state, game_message_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
                                name: player.name,
                                attack: attack.name
                            });
                            // Perform attack
                            const attackEffect = new game_effects_1.AttackEffect(player, opponent, attack);
                            store.reduceEffect(state, attackEffect);
                            if (store.hasPrompts()) {
                                store.waitPrompt(state, () => { });
                            }
                            if (attackEffect.damage > 0) {
                                const dealDamage = new attack_effects_1.DealDamageEffect(attackEffect, attackEffect.damage);
                                state = store.reduceEffect(state, dealDamage);
                            }
                        }
                        return state;
                    });
                }
                ;
            });
        }
        return state;
    }
}
exports.Bunnelby = Bunnelby;
