"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xerneas = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Xerneas extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = Y;
        this.hp = 130;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Lead',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a Supporter card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Bright Horns',
                cost: [Y, Y, Y],
                damage: 130,
                text: 'This Pokémon can\'t use Bright Horns during your next turn.'
            }];
        this.set = 'CIN';
        this.name = 'Xerneas';
        this.fullName = 'Xerneas CIN';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '73';
        this.ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
        this.ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length === 0) {
                return state;
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min: 0, max: 1, allowCancel: false }), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
                    store.prompt(state, [new game_1.ShowCardsPrompt(opponent.id, game_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards)], () => {
                        cards.forEach((card, index) => {
                            store.log(state, game_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                        });
                        player.deck.moveCardsTo(cards, player.hand);
                    });
                }
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
            effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
            effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            // Check marker
            if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
                console.log('attack blocked');
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
            console.log('marker added');
        }
        return state;
    }
}
exports.Xerneas = Xerneas;
