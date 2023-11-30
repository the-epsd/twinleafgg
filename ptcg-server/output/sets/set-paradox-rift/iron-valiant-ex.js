"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronValiantex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronValiantex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.FUTURE];
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Tachyon Bits',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
            }
        ];
        this.attacks = [
            {
                name: 'Laser Blade',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 200,
                text: 'During your next turn, this Pokémon can’t attack.'
            }
        ];
        this.set = 'PAR';
        this.set2 = 'futureflash';
        this.setNumber = '38';
        this.name = 'Iron Valiant ex';
        this.fullName = 'Iron Valiant ex PAR';
        this.TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            this.movedToActiveThisTurn = false;
            console.log('movedToActiveThisTurn = false');
            effect.player.marker.removeMarker(this.TACHYON_BITS_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (this.movedToActiveThisTurn == true) {
                effect.player.marker.addMarker(this.TACHYON_BITS_MARKER, this);
                console.log('marker added');
            }
            if (player.marker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { max: 1, allowCancel: true }), selected => {
                    if (!selected || selected.length === 0) {
                        return state;
                    }
                    const target = selected[0];
                    target.damage += 20;
                });
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                // Check marker
                if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                    console.log('attack blocked');
                    throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
                }
                effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
                console.log('marker added');
            }
            return state;
        }
        return state;
    }
}
exports.IronValiantex = IronValiantex;
