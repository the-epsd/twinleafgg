"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZamazentaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class ZamazentaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.METAL;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.resistance = [{ type: card_types_1.CardType.GRASS, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Regal Stance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
            }];
        this.attacks = [
            {
                name: 'Revenge Blast',
                cost: [card_types_1.CardType.METAL, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'This attack does 30 more damage for each Prize card your opponent has taken.'
            },
        ];
        this.set = 'CRZ';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '98';
        this.name = 'Zamazenta V';
        this.fullName = 'Zamazenta V CRZ';
        this.REGAL_STANCE_MARKER = 'REGAL_STANCE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.REGAL_STANCE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = player.hand.cards.filter(c => c !== this);
            player.hand.moveCardsTo(cards, player.discard);
            player.deck.moveTo(player.hand, 5);
            player.marker.addMarker(this.REGAL_STANCE_MARKER, this);
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 30;
            effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
        }
        return state;
    }
}
exports.ZamazentaV = ZamazentaV;
