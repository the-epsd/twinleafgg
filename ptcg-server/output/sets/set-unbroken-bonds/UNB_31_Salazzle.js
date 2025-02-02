"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Salazzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.evolvesFrom = 'Salandit';
        this.powers = [{
                name: 'Roast Reveal',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may discard a [R] Energy card from your hand. If you do, draw 3 cards.'
            }];
        this.attacks = [{
                name: 'Combustion',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 60,
                text: ''
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '27';
        this.name = 'Salazzle';
        this.fullName = 'Salazzle UNB';
        this.ROAST_REVEAL_MARKER = 'ROAST_REVEAL_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.ROAST_REVEAL_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.ROAST_REVEAL_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasFireEnergyInHand = player.hand.cards.some(c => {
                return c instanceof game_1.EnergyCard && c.provides.includes(card_types_1.CardType.FIRE);
            });
            if (!hasFireEnergyInHand) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.ROAST_REVEAL_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: true, min: 1, max: 1 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                player.marker.addMarker(this.ROAST_REVEAL_MARKER, this);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addSpecialCondition(card_types_1.SpecialCondition.ABILITY_USED);
                    }
                });
                player.hand.moveCardsTo(cards, player.discard);
                player.deck.moveTo(player.hand, 3);
            });
            return state;
        }
        return state;
    }
}
exports.Salazzle = Salazzle;
