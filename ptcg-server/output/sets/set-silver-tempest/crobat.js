"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crobat = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Crobat extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [];
        this.evolvesFrom = 'Golbat';
        this.attacks = [{
                name: 'Venomous Fang',
                cost: [card_types_1.CardType.DARK],
                damage: 50,
                text: 'Your opponent\'s Active Pokemon is now Poisoned.'
            },
            {
                name: 'Critical Bite',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 30 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) If 1 of your opponent\'s Pokemon is Knocked Out by damage from this attack, take 2 more Prize Cards.',
            }];
        this.set = 'SIT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '105';
        this.name = 'Crobat';
        this.fullName = 'Crobat SIT';
        this.usedCriticalBite = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.usedCriticalBite = false;
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            this.usedCriticalBite = true;
            console.log('Just used Critical Bite: ' + this.usedCriticalBite);
            const max = Math.min(1);
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: max, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 30);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                    return state;
                });
            });
        }
        if (effect instanceof game_effects_1.KnockOutEffect) {
            console.log('Checking if the target was KO\'d: ' + this.usedCriticalBite);
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Do not activate between turns, or when it's not opponents turn.
            if (state.phase !== game_1.GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
                return state;
            }
            // Crobat wasn't attacking
            const pokemonCard = opponent.active.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            // Check if the attack that caused the KnockOutEffect is "Critical Bite"
            if (this.usedCriticalBite === true) {
                if (effect.prizeCount > 0) {
                    effect.prizeCount += 2;
                    this.usedCriticalBite = false;
                    console.log('Reset Critical Bite after taking 2: ' + this.usedCriticalBite);
                }
            }
            return state;
        }
        return state;
    }
}
exports.Crobat = Crobat;
