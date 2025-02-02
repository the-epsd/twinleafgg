"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Torchic = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Torchic extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Barrage',
                powerType: pokemon_types_1.PowerType.ANCIENT_TRAIT,
                text: 'This Pokémon may attack twice a turn. (If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.)'
            }];
        this.attacks = [{
                name: 'Flare Bonus',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: ' Discard a [R] Energy card from your hand. If you do, draw 2 cards. '
            },
            {
                name: 'Claw',
                cost: [card_types_1.CardType.FIRE],
                damage: 20,
                text: ' Flip a coin. If tails, this attack does nothing. '
            }];
        this.set = 'PRC';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '26';
        this.name = 'Torchic';
        this.fullName = 'Torchic PRC';
        this.attacksThisTurn = 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.attacksThisTurn = 0;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack !== this.attacks[0] &&
            effect.attack !== this.attacks[1] && effect.player.active.cards.includes(this)) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const thisPokemon = player.active.cards;
            //do the attack that's NOT on the pokemon
            this.attacksThisTurn += 1;
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, thisPokemon, { allowCancel: false }), result => {
                        selected = result;
                        const attack = selected;
                        if (attack !== null) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
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
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const thisPokemon = player.active.cards;
            //DO ATTACK
            let hasCardsInHand = false;
            const blocked = [];
            player.hand.cards.forEach((c, index) => {
                if (c instanceof game_1.EnergyCard) {
                    if (c.provides.includes(card_types_1.CardType.FIRE)) {
                        hasCardsInHand = true;
                    }
                    else {
                        blocked.push(index);
                    }
                }
            });
            if (hasCardsInHand === false) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1, blocked }), selected => {
                selected = selected || [];
                if (selected.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(selected, player.discard);
                player.deck.moveTo(player.hand, 2);
            });
            // BARRAGE ORIGIN TRAIT
            this.attacksThisTurn += 1;
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, thisPokemon, { allowCancel: false }), result => {
                        selected = result;
                        const attack = selected;
                        if (attack !== null) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
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
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const thisPokemon = player.active.cards;
            // DO ATTACK
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === false) {
                    effect.damage = 0;
                }
            });
            // BARRAGE ORIGIN TRAIT
            this.attacksThisTurn += 1;
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, thisPokemon, { allowCancel: false }), result => {
                        selected = result;
                        const attack = selected;
                        if (attack !== null) {
                            store.log(state, game_1.GameLog.LOG_PLAYER_COPIES_ATTACK, {
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
            });
        }
        return state;
    }
}
exports.Torchic = Torchic;
