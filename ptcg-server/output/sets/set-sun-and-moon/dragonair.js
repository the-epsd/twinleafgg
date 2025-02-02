"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonair = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Dragonair extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Dratini';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.FAIRY }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Dragon\'s Wish',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'During your next turn, you may attach any number of Energy cards from your hand to your Pokémon.'
            }, {
                name: 'Tail Smack',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'SUM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '95';
        this.name = 'Dragonair';
        this.fullName = 'Dragonair SUM';
        this.DRAGONS_WISH_MARKER = 'DRAGONS_WISH_MARKER';
        this.DRAGONS_WISH_2_MARKER = 'DRAGONS_WISH_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGONS_WISH_2_MARKER, this)) {
            const player = effect.player;
            effect.player.marker.removeMarker(this.DRAGONS_WISH_MARKER, this);
            effect.player.marker.removeMarker(this.DRAGONS_WISH_2_MARKER, this);
            player.usedDragonsWish = false;
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.DRAGONS_WISH_MARKER, this)) {
            const player = effect.player;
            effect.player.marker.addMarker(this.DRAGONS_WISH_2_MARKER, this);
            player.usedDragonsWish = true;
            console.log('second marker added');
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            effect.player.marker.addMarker(this.DRAGONS_WISH_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.Dragonair = Dragonair;
