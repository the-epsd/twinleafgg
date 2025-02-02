"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedichamV = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class MedichamV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.cardType = game_1.CardType.FIGHTING;
        this.hp = 210;
        this.weakness = [{ type: game_1.CardType.PSYCHIC }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Yoga Loop',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon. If your opponent\'s Pokémon is Knocked Out by this attack, take another turn after this one. (Skip Pokémon Checkup.) If 1 of your Pokémon used Yoga Loop during your last turn, this attack can\'t be used.'
            },
            {
                name: 'Smash Uppercut',
                cost: [game_1.CardType.FIGHTING, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 100,
                text: 'This attack\'s damage isn\'t affected by Resistance.'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '83';
        this.name = 'Medicham V';
        this.fullName = 'Medicham V EVS';
        this.YOGA_LOOP_MARKER = 'YOGA_LOOP_MARKER';
        this.YOGA_LOOP_MARKER_2 = 'YOGA_LOOP_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
            effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
            effect.player.usedTurnSkip = false;
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
            effect.player.marker.addMarker(this.YOGA_LOOP_MARKER_2, this);
            effect.player.usedTurnSkip = false;
            console.log('marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check marker
            if (effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    const damageEffect = new attack_effects_1.PutDamageEffect(effect, 20);
                    damageEffect.target = target;
                    store.reduceEffect(state, damageEffect);
                    if (effect instanceof game_effects_1.KnockOutEffect && effect.target === target) {
                        player.marker.addMarker(this.YOGA_LOOP_MARKER, this);
                        effect.player.usedTurnSkip = true;
                        return state;
                    }
                });
                return state;
            });
        }
        return state;
    }
}
exports.MedichamV = MedichamV;
