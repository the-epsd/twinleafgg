"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diancie = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Diancie extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 90;
        this.powers = [{
                name: 'Princess\'s Curtain',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to your Benched Basic Pokémon.'
            }];
        this.attacks = [{
                name: 'Spike Draw',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Draw 2 cards.'
            }];
        this.set = 'ASR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '68';
        this.name = 'Diancie';
        this.fullName = 'Diancie ASR';
        this.PRINCESS_CURTAIN_MARKER = 'PRINCESS_CURTAIN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.PRINCESS_CURTAIN_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                console.log('BASICS UNPROTECTED');
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                    if (card.stage === card_types_1.Stage.BASIC) {
                        cardList.marker.removeMarker(this.PRINCESS_CURTAIN_MARKER, this);
                    }
                    if (player.active.cards[0] == this) {
                        console.log('BASICS PROTECTED');
                        player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                            if (card.stage === card_types_1.Stage.BASIC) {
                                cardList.marker.addMarker(this.PRINCESS_CURTAIN_MARKER, this);
                            }
                            if (effect instanceof game_1.ChoosePokemonPrompt) {
                                if (cardList.marker.hasMarker(this.PRINCESS_CURTAIN_MARKER, this)) {
                                    return state;
                                }
                            }
                            return state;
                        });
                        return state;
                    }
                    return state;
                });
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.Diancie = Diancie;
