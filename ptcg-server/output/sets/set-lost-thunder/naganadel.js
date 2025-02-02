"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Naganadel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
// LOT Naganadel 108 (https://limitlesstcg.com/cards/LOT/108)
class Naganadel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.ULTRA_BEAST];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Poipole';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Charging Up',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may attach a basic Energy card from your discard pile to this Pokémon. '
            }];
        this.attacks = [
            {
                name: 'Turning Point',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 80,
                text: 'If you have exactly 3 Prize cards remaining, this attack does 80 more damage.'
            },
        ];
        this.set = 'LOT';
        this.name = 'Naganadel';
        this.fullName = 'Naganadel LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '108';
        this.CHARGE_MARKER = 'CHARGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            if (player.marker.hasMarker(this.CHARGE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            // checking if there's energy in the discard
            const hasEnergyInDiscard = player.discard.cards.some(c => {
                return c instanceof game_1.EnergyCard
                    && c.energyType === card_types_1.EnergyType.BASIC;
            });
            if (!hasEnergyInDiscard) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 1, max: 1, allowCancel: false }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.marker.addMarker(this.CHARGE_MARKER, this);
                    player.discard.moveCardsTo(cards, cardList);
                }
            });
        }
        // Turning Point
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const prizesLeft = player.getPrizeLeft();
            if (prizesLeft === 3) {
                effect.damage += 80;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.CHARGE_MARKER, this);
        }
        return state;
    }
}
exports.Naganadel = Naganadel;
