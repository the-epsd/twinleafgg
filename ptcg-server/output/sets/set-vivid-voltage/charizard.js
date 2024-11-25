"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizard = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Charizard extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 170;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Battle Sense',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may look at the top 3 cards of your ' +
                    'deck and put 1 of them into your hand. Discard the other cards.'
            }];
        this.attacks = [
            {
                name: 'Royal Blaze',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 100,
                text: 'This attack does 50 more damage for each Leon card ' +
                    'in your discard pile.'
            }
        ];
        this.set = 'VIV';
        this.name = 'Charizard';
        this.fullName = 'Charizard VIV';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.BATTLE_SENSE_MARKER = 'BATTLE_SENSE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.BATTLE_SENSE_MARKER, this);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const cards = effect.player.discard.cards.filter(c => c.name === 'Leon');
            effect.damage += cards.length * 50;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.BATTLE_SENSE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            const deckTop = new game_1.CardList();
            player.deck.moveTo(deckTop, 3);
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 1, max: 1, allowCancel: false }), selected => {
                player.marker.addMarker(this.BATTLE_SENSE_MARKER, this);
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.discard);
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.BATTLE_SENSE_MARKER, this);
        }
        return state;
    }
}
exports.Charizard = Charizard;
