"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChienPao = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ChienPao extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'H';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C];
        this.powers = [{
                name: 'Pumpkin Pit',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard a Stadium in play.'
            }];
        this.attacks = [
            {
                name: 'Stampede',
                cost: [W, W, C],
                damage: 120,
                text: 'Put an Energy attached to this Pokémon into your hand.'
            }
        ];
        this.set = 'SV8';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Chien-Pao';
        this.fullName = 'Chien-Pao SV8';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                        return state;
                    }
                    return state;
                });
            }
        }
        return state;
    }
}
exports.ChienPao = ChienPao;
