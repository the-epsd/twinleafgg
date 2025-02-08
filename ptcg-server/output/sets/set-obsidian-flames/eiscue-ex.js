"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eiscueex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_1 = require("../../game");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const costs_1 = require("../../game/store/prefabs/costs");
class Eiscueex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = R;
        this.hp = 210;
        this.weakness = [{ type: W }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Scalding Block',
                cost: [W, W, W],
                damage: 160,
                text: 'Discard an Energy from this Pokémon. During your opponent\'s next turn, the Defending Pokémon can\'t attack.'
            }
        ];
        this.regulationMark = 'G';
        this.set = 'OBF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Eiscue ex';
        this.fullName = 'Eiscue ex OBF';
        this.SCALDING_BLOCK_MARKER = 'SCALDING_BLOCK_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const opponent = effect.opponent;
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
            opponent.marker.addMarker(this.SCALDING_BLOCK_MARKER, this);
            opponent.active.marker.addMarker(this.SCALDING_BLOCK_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect
            && effect.player.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)
            && effect.source.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
            effect.player.marker.removeMarker(this.SCALDING_BLOCK_MARKER, this);
            effect.player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (cardList.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
                    cardList.marker.removeMarker(this.SCALDING_BLOCK_MARKER, this);
                }
            });
        }
        return state;
    }
}
exports.Eiscueex = Eiscueex;
