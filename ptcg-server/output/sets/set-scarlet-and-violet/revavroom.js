"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revavroom = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Revavroom extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 140;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Varoom';
        this.powers = [{
                name: 'Rumbling Engine',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'You must discard an Energy card from your hand in order to use this Ability. Once during your turn, you may draw cards until you have 6 cards in your hand.'
            }];
        this.attacks = [{
                name: 'Knock Away',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 90,
                damageCalculation: '+',
                text: 'Flip a coin. If heads, this attack does 90 more damage.'
            }];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '142';
        this.name = 'Revavroom';
        this.fullName = 'Revavroom SVI';
        this.RUMBLING_ENGINE_MARKER = 'RUMBLING_ENGINE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.RUMBLING_ENGINE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.hand.cards.length >= 7) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const hasEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard;
            });
            if (!hasEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.RUMBLING_ENGINE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.hand.moveCardsTo(cards, player.discard);
                while (player.hand.cards.length < 6) {
                    if (player.deck.cards.length === 0) {
                        break;
                    }
                    player.deck.moveTo(player.hand, 1);
                }
                player.marker.addMarker(this.RUMBLING_ENGINE_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                });
            });
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], result => {
                if (result === true) {
                    effect.damage += 90;
                }
            });
        }
        return state;
    }
}
exports.Revavroom = Revavroom;
