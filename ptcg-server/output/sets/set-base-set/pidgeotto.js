"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pidgeotto = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
const game_effects_1 = require("../../game/store/effects/game-effects");
const __1 = require("../..");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Pidgeotto extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.fullName = 'Pidgeotto BS';
        this.name = 'Pidgeotto';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Pidgey';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.hp = 60;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.mirrorMoveEffects = [];
        this.attacks = [
            {
                name: 'Whirlwind',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
            },
            {
                name: 'Mirror Move',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBench) {
                return state;
            }
            let targets = [];
            if (opponentHasBench) {
                store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(opponent.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { allowCancel: false }), results => {
                    targets = results || [];
                });
                if (targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            this.mirrorMoveEffects.forEach(effect => {
                effect.target = opponent.active;
                effect.opponent;
                effect.player = player;
                effect.source = player.active;
                // eslint-disable-next-line no-self-assign
                effect.attackEffect = effect.attackEffect;
                store.reduceEffect(state, effect.attackEffect);
            });
        }
        if (effect instanceof attack_effects_1.AbstractAttackEffect && effect.target.cards.includes(this)) {
            const pokemonCard = effect.target.getPokemonCard();
            if (pokemonCard !== this) {
                return state;
            }
            this.mirrorMoveEffects.push(effect);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
                this.mirrorMoveEffects = [];
            }
            return state;
        }
        return state;
    }
}
exports.Pidgeotto = Pidgeotto;
