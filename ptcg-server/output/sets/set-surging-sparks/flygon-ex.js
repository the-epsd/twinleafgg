"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flygonex = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Flygonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Vibrava';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.regulationMark = 'H';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 310;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Storm Bug',
                cost: [card_types_1.CardType.FIGHTING],
                damage: 130,
                text: 'You may switch this Pokémon with a Pokémon on your Bench.'
            },
            {
                name: 'Peridot Sonic',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.FIGHTING, card_types_1.CardType.METAL],
                damage: 0,
                text: 'This attack does 100 damage to each of your opponent\'s Pokémon ex and Pokémon V. (Don\'t apply Weakness or Resistance for this damage.)'
            }
        ];
        this.set = 'SSP';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '106';
        this.name = 'Flygon ex';
        this.fullName = 'Flygon ex SV7a';
        this.stormBug = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            this.stormBug = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.stormBug == true) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            this.stormBug = false;
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_SWITCH_POKEMON), wantToUse => {
                if (wantToUse) {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                        if (!selected || selected.length === 0) {
                            return state;
                        }
                        const target = selected[0];
                        player.switchPokemon(target);
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const targetTags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.POKEMON_VSTAR, card_types_1.CardTag.POKEMON_VMAX, card_types_1.CardTag.POKEMON_ex];
            const damageTargets = [opponent.active, ...opponent.bench].filter(pokemon => {
                const card = pokemon.getPokemonCard();
                return card && targetTags.some(tag => card.tags.includes(tag));
            });
            damageTargets.forEach(target => {
                const damageEffect = new attack_effects_1.PutDamageEffect(effect, 100);
                damageEffect.target = target;
                effect.ignoreWeakness = true;
                effect.ignoreResistance = true;
                store.reduceEffect(state, damageEffect);
            });
            return state;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Flygonex = Flygonex;
