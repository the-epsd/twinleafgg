"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbok = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Arbok extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ekans';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Terror Strike',
                cost: [G],
                damage: 10,
                text: 'Flip a coin. If heads and if your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
            },
            {
                name: 'Poison Fang',
                cost: [G, G],
                damage: 20,
                text: 'The Defending Pokémon is now Poisoned.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '31';
        this.name = 'Arbok';
        this.fullName = 'Arbok FO';
        this.USED_TERROR_STRIKE = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.USED_TERROR_STRIKE = true;
        }
        if (effect instanceof attack_effects_1.AfterDamageEffect && this.USED_TERROR_STRIKE) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                    return state;
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.USED_TERROR_STRIKE == true) {
            this.USED_TERROR_STRIKE = false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialConditionEffect);
            return state;
        }
        return state;
    }
}
exports.Arbok = Arbok;
