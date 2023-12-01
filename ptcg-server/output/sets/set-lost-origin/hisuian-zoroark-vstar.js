"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HisuianZoroarkVSTAR = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class HisuianZoroarkVSTAR extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Hisuian Zoroark V';
        this.cardTag = [card_types_1.CardTag.POKEMON_VSTAR];
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 270;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Phantom Star',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may discard your hand and draw 7 cards. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Nightly Raid',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'This attack does 50 damage for each of your Pokémon that has any damage counters on it.'
            }
        ];
        this.set = 'LOR';
        this.set2 = 'lostorigin';
        this.setNumber = '147';
        this.name = 'Hisuian Zoroark VSTAR';
        this.fullName = 'Hisuian Zoroark VSTAR LOR';
        this.VSTAR_MARKER = 'VSTAR_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.VSTAR_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const damage = 0;
            state.players.forEach(player => {
                player.active.cards.forEach(card => {
                    if (damage > 0) {
                        effect.damage += 50;
                    }
                });
                player.bench.forEach(bench => {
                    bench.cards.forEach(card => {
                        if (damage > 0) {
                            effect.damage += 50;
                        }
                    });
                });
            });
            effect.damage = damage;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.VSTAR_MARKER)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 7);
            player.marker.addMarker(this.VSTAR_MARKER, this);
        }
        return state;
    }
}
exports.HisuianZoroarkVSTAR = HisuianZoroarkVSTAR;
