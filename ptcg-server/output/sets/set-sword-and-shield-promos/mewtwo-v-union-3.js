"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoVUnion3 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_message_1 = require("../../game/game-message");
const game_error_1 = require("../../game/game-error");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const __1 = require("../..");
const mewtwo_v_union_1_1 = require("./mewtwo-v-union-1");
// import { Card } from '../..';
class MewtwoVUnion3 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 0;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Propagation',
                useFromDiscard: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is in '
                    + 'your discard pile, you may put this Pokemon into your hand.'
            }];
        this.attacks = [{
                name: 'Union Gain',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Attach up to 2 [P] Energy cards from your discard pile to this Pokémon.'
            }];
        this.set = 'PLF';
        this.name = 'MewtwoVUnion1';
        this.fullName = 'MewtwoVUnion1 PLF';
        this.PROPAGATION_MAREKER = 'PROPAGATION_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if ((effect instanceof play_card_effects_1.PlayPokemonEffect) && effect.pokemonCard === this) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Check if card is in the discard
            if (player.discard.cards.includes(this) === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            let mewtwoVUnionCanBePlayed1 = false;
            player.forEachPokemon(__1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (player.discard.cards.includes(new mewtwo_v_union_1_1.MewtwoVUnion1()) === true) {
                    mewtwoVUnionCanBePlayed1 = true;
                }
            });
            //   let mewtwoVUnionCanBePlayed2 = false;
            //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //     if (player.discard.cards.includes(new MewtwoVUnion2()) === true) {
            //       mewtwoVUnionCanBePlayed2 = true;
            //     }
            //   });
            //   let mewtwoVUnionCanBePlayed3 = false;
            //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //     if (player.discard.cards.includes(new MewtwoVUnion3()) === true) {
            //       mewtwoVUnionCanBePlayed3 = true;
            //     }
            //   });
            //   let mewtwoVUnionCanBePlayed4 = false;
            //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            //     if (player.discard.cards.includes(new MewtwoVUnion4()) === true) {
            //       mewtwoVUnionCanBePlayed4 = true;
            //     }
            //   });
            //   if (mewtwoVUnionCanBePlayed1 && mewtwoVUnionCanBePlayed2 && mewtwoVUnionCanBePlayed3 && mewtwoVUnionCanBePlayed4) {
            if (mewtwoVUnionCanBePlayed1) {
                const MewTwoVUnion = {
                    name: 'Mewtwo V-Union',
                    set: 'SWSH',
                    superType: card_types_1.SuperType.POKEMON,
                    format: card_types_1.Format.STANDARD,
                    fullName: 'Mewtwo V-Union',
                    id: 0,
                    regulationMark: 'E',
                    tags: [card_types_1.CardTag.POKEMON_V],
                    setNumber: '6',
                    set2: 'v-unionspecialset',
                    cardType: card_types_1.CardType.PSYCHIC,
                    cardTag: [],
                    pokemonType: card_types_1.PokemonType.NORMAL,
                    evolvesFrom: '',
                    stage: card_types_1.Stage.BASIC,
                    retreat: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                    hp: 310,
                    weakness: [{ type: card_types_1.CardType.DARK }],
                    resistance: [{ type: card_types_1.CardType.FIGHTING, value: -30 }],
                    movedToActiveThisTurn: false,
                    powers: [],
                    attacks: [{
                            name: 'Attack 1',
                            cost: [card_types_1.CardType.COLORLESS],
                            damage: 10,
                            text: ''
                        }],
                    reduceEffect: function (store, state, effect) {
                        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
                            const player = effect.player;
                            const opponent = __1.StateUtils.getOpponent(state, player);
                            const defending = opponent.active.getPokemonCard();
                            if (!defending || defending.tags.includes(card_types_1.CardTag.POKEMON_V || card_types_1.CardTag.POKEMON_VSTAR || card_types_1.CardTag.POKEMON_VMAX)) {
                                effect.damage += 120;
                                return state;
                            }
                            return state;
                        }
                        return state;
                    }
                };
                const playPokemonEffect = new play_card_effects_1.PlayPokemonEffect(effect.player, MewTwoVUnion, player.bench[0]);
                state = store.reduceEffect(state, playPokemonEffect);
                player.marker.addMarker(this.PROPAGATION_MAREKER, this);
                player.discard.moveCardTo(this, player.hand);
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.MewtwoVUnion3 = MewtwoVUnion3;
