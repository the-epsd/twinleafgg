"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IronBundle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class IronBundle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardTag = [card_types_1.CardTag.FUTURE];
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Tachyon Bits',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is on your Bench, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.) If you do, discard this Pokémon and all attached cards.'
            }
        ];
        this.attacks = [
            {
                name: 'Refrigerated Stream',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: ''
            }
        ];
        this.set = 'PAR';
        this.set2 = 'paradoxrift';
        this.setNumber = '56';
        this.name = 'Iron Bundle';
        this.fullName = 'Iron Bundle PAR';
        this.REFRIGERATED_STREAM_MARKER = 'REFRIGERATED_STREAM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.active.cards[0] == this) {
                return state; // Not active
            }
            if (hasBench === false) {
                return state;
            }
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                    player.bench[benchIndex].moveTo(player.discard);
                    player.bench[benchIndex].clearEffects();
                    return state;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.REFRIGERATED_STREAM_MARKER, this);
        }
        if (effect instanceof game_effects_1.UseAttackEffect && effect.player.active.marker.hasMarker(this.REFRIGERATED_STREAM_MARKER, this)) {
            throw new game_1.GameError(game_message_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.REFRIGERATED_STREAM_MARKER, this);
        }
        return state;
    }
}
exports.IronBundle = IronBundle;
