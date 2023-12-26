"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GougingFireex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GougingFireex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Heat Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            },
            {
                name: 'Explosive Flare',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 260,
                text: 'This Pokémon can’t use Exploding Flare again until it leaves the Active Spot.'
            }
        ];
        this.set = 'SV5K';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '012';
        this.name = 'Gouging Fire ex';
        this.fullName = 'Gouging Fire ex';
        this.EXPLODING_FLARE_MARKER = 'EXPLODING_FLARE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                player.marker.removeMarker(this.EXPLODING_FLARE_MARKER, this);
                console.log('gouging fire ex marker removed - no longer in active spot');
            }
            if (player.marker.hasMarker(this.EXPLODING_FLARE_MARKER, this)) {
                console.log('gouging fire ex attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.marker.addMarker(this.EXPLODING_FLARE_MARKER, this);
            console.log('gouging fire ex marker added');
            return state;
        }
        return state;
    }
}
exports.GougingFireex = GougingFireex;
