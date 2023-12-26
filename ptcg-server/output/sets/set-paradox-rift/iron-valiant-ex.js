"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronValiantex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
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
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '38';
        this.name = 'Iron Valiant ex';
        this.fullName = 'Iron Valiant ex PAR';
        this.TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        // if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
        //   effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
        //   effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        //   console.log('marker cleared');
        // }
        // if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        //   effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        //   console.log('second marker added');
        // }
        // if (effect instanceof EndTurnEffect) {
        //   this.movedToActiveThisTurn = false;
        //   console.log('movedToActiveThisTurn = false');
        //   effect.player.marker.removeMarker(this.TACHYON_BITS_MARKER, this);
        // }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            this.movedToActiveThisTurn = false;
            const player = game_1.StateUtils.findOwner(state, effect.target);
            if (this.movedToActiveThisTurn) {
                {
                    // Try to reduce PowerEffect, to check if something is blocking our ability
                    try {
                        const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                        store.reduceEffect(state, powerEffect);
                    }
                    catch (_a) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH, game_1.SlotType.ACTIVE], { min: 1, max: 1, allowCancel: true }), selected => {
                        const targets = selected || [];
                        targets.forEach(target => {
                            target.damage += 20;
                        });
                    });
                }
            }
            //       if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
            //         // Check marker
            //         if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            //           console.log('attack blocked');
            //           throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
            //         }
            //         effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            //         console.log('marker added');
            //       }
            return state;
        }
        return state;
    }
}
exports.IronValiantex = IronValiantex;
