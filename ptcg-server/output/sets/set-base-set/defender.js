"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Defender = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Defender extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.ITEM;
        this.set = 'BS';
        this.name = 'Defender';
        this.fullName = 'Defender BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '80';
        this.text = 'Attach Defender to 1 of your Pokémon. At the end of your opponent\'s next turn, discard Defender. Damage done to that Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).';
        this.DEFENDER_MARKER = 'DEFENDER_MARKER';
        this.CLEAR_DEFENDER_MARKER = 'CLEAR_DEFENDER_MARKER';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, min: 1, max: 1 }), (results) => {
                var _a;
                if (results && results.length > 0) {
                    const targetPokemon = results[0];
                    targetPokemon.marker.addMarker(this.DEFENDER_MARKER, this);
                    ((_a = targetPokemon.tool) === null || _a === void 0 ? void 0 : _a.cards.cards.length) === 0;
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    opponent.marker.addMarker(this.CLEAR_DEFENDER_MARKER, this);
                }
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect && ((_a = effect.target.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this))) {
            effect.damage -= 20;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_DEFENDER_MARKER)) {
            const player = effect.player;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                if (cardList.marker.hasMarker(this.DEFENDER_MARKER, this)) {
                    cardList.marker.removeMarker(this.DEFENDER_MARKER, this);
                    cardList.moveCardTo(this, player.discard);
                }
            });
        }
        return state;
    }
}
exports.Defender = Defender;
