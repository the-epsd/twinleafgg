"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jumpluff = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Jumpluff extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Skiploom';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.powers = [{
                name: 'Fluffy Barrage',
                powerType: game_1.PowerType.ABILITY,
                text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon,'
                    + ' you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Spinning Attack',
                cost: [card_types_1.CardType.GRASS],
                damage: 60,
                text: ''
            }];
        this.set = 'EVS';
        this.regulationMark = 'E';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Jumpluff';
        this.fullName = 'Jumpluff EVS';
        this.attacksThisTurn = 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.attacksThisTurn = 0;
        }
        //Copying TM or Scroll
        if (effect instanceof game_effects_1.AttackEffect && effect.attack !== this.attacks[0] && effect.player.active.cards.includes(this)) {
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
                ;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const thisPokemon = player.active.cards.filter(x => x.name === this.name || (x instanceof game_1.TrainerCard && x.trainerType === card_types_1.TrainerType.TOOL));
            // Ask if want to activate Fluyffy Barrage
            this.attacksThisTurn += 1;
            if (this.attacksThisTurn >= 2) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_BARRAGE), wantToUse => {
                if (wantToUse) {
                    let selected;
                    store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, thisPokemon, { allowCancel: false, }), result => {
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
                ;
            });
        }
        return state;
    }
}
exports.Jumpluff = Jumpluff;
