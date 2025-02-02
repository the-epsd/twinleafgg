"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaquaval = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Quaquaval extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Quaxwell';
        this.cardType = W;
        this.hp = 170;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Up-Tempo',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'You must put a card from your hand on the bottom of your deck in order to use this Ability. Once during your turn, you may draw cards until you have 5 cards in your hand.'
            }];
        this.attacks = [
            {
                name: 'Hydro Splash',
                cost: [W, C],
                damage: 120,
                text: ''
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SSP';
        this.setNumber = '52';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Quaquaval';
        this.fullName = 'Quaquaval SSP';
        this.UP_TEMPO_MARKER = 'UP_TEMPO_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (this.marker.hasMarker(this.UP_TEMPO_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.hand.cards.length > 5 || player.hand.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, {}, { allowCancel: false, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                prefabs_1.ABILITY_USED(player, this);
                this.marker.addMarker(this.UP_TEMPO_MARKER, this);
                player.marker.addMarker(this.UP_TEMPO_MARKER, this);
                player.hand.moveCardsTo(cards, player.deck);
                while (player.hand.cards.length < 5) {
                    player.deck.moveTo(player.hand, 1);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.UP_TEMPO_MARKER, this)) {
            effect.player.marker.removeMarker(this.UP_TEMPO_MARKER, this);
            this.marker.removeMarker(this.UP_TEMPO_MARKER, this);
        }
        return state;
    }
}
exports.Quaquaval = Quaquaval;
