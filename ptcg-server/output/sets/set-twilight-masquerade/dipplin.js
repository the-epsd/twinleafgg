"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dipplin = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Dipplin extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Applin';
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.GRASS;
        this.cardTypez = card_types_1.CardType.DIPPLIN;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Festival Lead',
                powerType: game_1.PowerType.ABILITY,
                text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Do the Wave',
                cost: [card_types_1.CardType.GRASS],
                damage: 20,
                text: 'This attack does 20 damage for each of your Benched Pokémon.'
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Dipplin';
        this.fullName = 'Dipplin TWM';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const activePokemon = opponent.active.getPokemonCard();
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (activePokemon) {
                const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                effect.damage = playerBenched * 20;
            }
            // Handle PowerEffect after damage is resolved
            // Check if 'Festival Plaza' stadium is in play
            if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
                if (effect.damage > 0) {
                    const dealDamage = new attack_effects_1.DealDamageEffect(effect, effect.damage);
                    state = store.reduceEffect(state, dealDamage);
                    try {
                        const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                        store.reduceEffect(state, powerEffect);
                    }
                    catch (_a) {
                        return state;
                    }
                    state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_FESTIVAL_FEVER), wantToUse => {
                        if (!wantToUse) {
                            effect.damage = 0;
                            return state;
                        }
                        const opponent = game_1.StateUtils.getOpponent(state, player);
                        // Do not activate between turns, or when it's not the opponent's turn.
                        if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                            return state;
                        }
                        const activeDipplin = player.active.cards.filter(card => card instanceof game_1.PokemonCard);
                        let selected;
                        store.prompt(state, new game_1.ChooseAttackPrompt(player.id, game_1.GameMessage.CHOOSE_ATTACK_TO_COPY, activeDipplin, { allowCancel: false }), result => {
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
                    });
                }
            }
        }
        return state;
    }
}
exports.Dipplin = Dipplin;
