"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiantHisuianSneasler = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RadiantHisuianSneasler extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.RADIANT];
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Poison Peak',
                powerType: game_1.PowerType.ABILITY,
                text: 'During Pokémon Checkup, put 2 more damage counters on your opponent\'s Poisoned Pokémon.'
            }];
        this.attacks = [{
                name: 'Poison Jab',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                text: 'Your opponent\'s Active Pokémon is now Poisoned.'
            }];
        this.set = 'LOR';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Radiant Hisuian Sneasler';
        this.fullName = 'Radiant Hisuian Sneasler LOR';
        this.POISON_MODIFIER_MARKER = 'POISON_MODIFIER_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.BetweenTurnsEffect) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    try {
                        const stub = new game_effects_1.PowerEffect(player, {
                            name: 'test',
                            powerType: game_1.PowerType.ABILITY,
                            text: ''
                        }, this);
                        store.reduceEffect(state, stub);
                    }
                    catch (_a) {
                        return state;
                    }
                    if (this.marker.hasMarker(this.POISON_MODIFIER_MARKER)) {
                        return state;
                    }
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    if (opponent.active.specialConditions.includes(card_types_1.SpecialCondition.POISONED)) {
                        opponent.active.poisonDamage += 20;
                        this.marker.addMarker(this.POISON_MODIFIER_MARKER, this);
                    }
                }
            });
        }
        if (effect instanceof game_phase_effects_1.BeginTurnEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    this.marker.removeMarker(this.POISON_MODIFIER_MARKER, this);
                }
            });
            opponent.active.poisonDamage -= 20;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            store.reduceEffect(state, specialCondition);
            return state;
        }
        return state;
    }
}
exports.RadiantHisuianSneasler = RadiantHisuianSneasler;
