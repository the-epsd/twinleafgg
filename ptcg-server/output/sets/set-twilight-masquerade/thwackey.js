"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thwackey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Thwackey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grookey';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Boom Boom Groove',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, if your Active Pokémon has the Festival Lead Ability, you may search your deck for a card and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Beat',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 50,
                text: ''
            }
        ];
        this.set = 'TWM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '15';
        this.name = 'Thwackey';
        this.fullName = 'Thwackey TWM';
        this.BOOM_BOOM_DRUM_MARKER = 'BOOM_BOOM_DRUM_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BOOM_BOOM_DRUM_MARKER, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.BOOM_BOOM_DRUM_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // if (activePokemon && activePokemon.powers[0].name !== 'Fesival Lead') {
            //   throw new GameError(GameMessage.CANNOT_USE_POWER);
            // }
            if (player.marker.hasMarker(this.BOOM_BOOM_DRUM_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            const activePokemon = player.active.getPokemonCard();
            if (activePokemon && activePokemon.powers) {
                const hasFestivalLead = activePokemon.powers.some(power => power.name === 'Festival Lead');
                if (!hasFestivalLead) {
                    throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
                }
                if (hasFestivalLead) {
                    player.marker.addMarker(this.BOOM_BOOM_DRUM_MARKER, this);
                    player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                        if (cardList.getPokemonCard() === this) {
                            cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                        }
                    });
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 1, allowCancel: false }), cards => {
                        player.deck.moveCardsTo(cards, player.hand);
                        return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                            player.deck.applyOrder(order);
                        });
                    });
                }
            }
        }
        return state;
    }
}
exports.Thwackey = Thwackey;
