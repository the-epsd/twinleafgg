"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewtwoVUnion1 = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_message_1 = require("../../game/game-message");
const game_error_1 = require("../../game/game-error");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const charizard_ex_1 = require("../set-obsidian-flames/charizard-ex");
// import { MewtwoVUnion2 } from './mewtwo-v-union-2';
// import { MewtwoVUnion3 } from './mewtwo-v-union-3';
// import { MewtwoVUnion4 } from './mewtwo-v-union-4';
// import { Card } from '../..';
class MewtwoVUnion1 extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 10;
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
        this.set = 'SWSH';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '181';
        this.name = 'MewtwoVUnion1';
        this.fullName = 'MewtwoVUnion1 PLF';
    }
    // public readonly PROPAGATION_MAREKER = 'PROPAGATION_MAREKER';
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Check if card is in the discard
            if (player.discard.cards.includes(this) === false) {
                throw new game_error_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            let mewtwoVUnionCanBePlayed1 = false;
            if (player.discard.cards.includes(this) === false) {
                mewtwoVUnionCanBePlayed1 = true;
            }
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
                //     const MewTwoVUnion: PokemonCard = {
                //       name: 'Mewtwo V-Union',
                //       set: 'SWSH',
                //       superType: SuperType.POKEMON,
                //       format: Format.STANDARD,
                //       fullName: 'Mewtwo V-Union',
                //       id: 0,
                //       regulationMark: 'E',
                //       tags: [CardTag.POKEMON_V],
                //       setNumber: '6',
                //       set2: 'v-unionspecialset',
                //       cardType: CardType.PSYCHIC,
                //       cardTag: [],
                //       pokemonType: PokemonType.NORMAL,
                //       evolvesFrom: '',
                //       stage: Stage.BASIC,
                //       retreat: [CardType.COLORLESS, CardType.COLORLESS],
                //       hp: 310,
                //       weakness: [{ type: CardType.DARK }],
                //       resistance: [{ type: CardType.FIGHTING, value: -30 }],
                //       movedToActiveThisTurn: false,
                //       powers: [],
                //       attacks: [    {
                //         name: 'Attack 1',
                //         cost: [ CardType.COLORLESS],
                //         damage: 10,
                //         text: ''
                //       }],
                //       reduceEffect: function (store: StoreLike, state: State, effect: Effect): State {
                //         if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
                //           const player = effect.player;
                //           const opponent = StateUtils.getOpponent(state, player);
                //           const defending = opponent.active.getPokemonCard();
                //           if (!defending || defending.tags.includes(CardTag.POKEMON_V || CardTag.POKEMON_VSTAR || CardTag.POKEMON_VMAX)) {
                //             effect.damage += 120;
                //             return state;
                //           }  
                //           return state;
                //         }
                //         return state;
                //       }
                //     };
                const slots = player.bench.filter(b => b.cards.length === 0);
                const Zard = new charizard_ex_1.Charizardex();
                if (slots.length > 0) {
                    new play_card_effects_1.PlayPokemonEffect(effect.player, Zard, slots[0]);
                    slots[0].pokemonPlayedTurn = state.turn;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.MewtwoVUnion1 = MewtwoVUnion1;
