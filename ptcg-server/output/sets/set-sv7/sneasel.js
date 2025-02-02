"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sneasel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Sneasel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Cut',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            },
            {
                name: 'Draw Near',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 30,
                text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Sneasel';
        this.fullName = 'Sneasel SV6a';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        if (effect instanceof game_effects_1.RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
            throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
        }
        // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        //   if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
        //     const player = effect.player;
        //     const opponent = state.players[1 - state.players.indexOf(player)];
        //     opponent.active.marker.addMarkerToState(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
        //   }
        return state;
    }
}
exports.Sneasel = Sneasel;
