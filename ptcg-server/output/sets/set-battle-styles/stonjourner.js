"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stonjourner = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Stonjourner extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.tags = [card_types_1.CardTag.SINGLE_STRIKE];
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Land\'s Pulse',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: 'If a Stadium is in play, this attack does 30 more damage.',
                effect: (store, state, effect) => {
                    const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                    if (stadiumCard !== undefined) {
                        effect.damage += 30;
                        // Discard Stadium
                        const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                        const player = game_1.StateUtils.findOwner(state, cardList);
                        cardList.moveTo(player.discard);
                    }
                    return state;
                }
            },
            {
                name: 'Giga Hammer',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'During your next turn, this Pokémon can\'t use Giga Hammer.',
                effect: (store, state, effect) => {
                    const player = effect.player;
                    if (player.active.cards[0] !== this) {
                        player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
                        player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
                        console.log('removed markers because not active');
                    }
                    // Check marker
                    if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                        console.log('attack blocked');
                        throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
                    }
                    effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
                    console.log('marker added');
                    return state;
                }
            }
        ];
        this.set = 'BST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '84';
        this.name = 'Stonjourner';
        this.fullName = 'Stonjourner BST';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('marker cleared');
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
            console.log('second marker added');
        }
        return super.reduceEffect(store, state, effect);
    }
}
exports.Stonjourner = Stonjourner;
