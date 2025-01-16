"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoOhEx = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
function* useRebirth(next, store, state, self, effect) {
    const player = effect.player;
    // Check if card is in the discard
    if (player.discard.cards.includes(self) === false) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const slots = player.bench.filter(b => b.cards.length === 0);
    if (slots.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    // Power already used
    if (player.marker.hasMarker(self.REBIRTH_MAREKER, self)) {
        throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
    }
    player.marker.addMarker(self.REBIRTH_MAREKER, self);
    let flipResult = false;
    yield store.prompt(state, [
        new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
    ], result => {
        flipResult = result;
        next();
    });
    if (flipResult === false) {
        return state;
    }
    player.discard.moveCardTo(self, slots[0]);
    let basicEnergies = 0;
    const typeMap = {};
    player.discard.cards.forEach(c => {
        if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
            const cardType = c.provides[0];
            if (typeMap[cardType] === undefined) {
                basicEnergies += 1;
                typeMap[cardType] = true;
            }
        }
    });
    if (basicEnergies === 0) {
        return state;
    }
    const count = Math.min(3, basicEnergies);
    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: count, max: count, allowCancel: false, differentTypes: true }), selected => {
        const cards = selected || [];
        player.discard.moveCardsTo(cards, slots[0]);
    });
}
class HoOhEx extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_EX];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Rebirth',
                useFromDiscard: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokemon is ' +
                    'in your discard pile, you may flip a coin. If heads, put this Pokemon ' +
                    'onto your Bench and attach 3 different types of basic Energy cards ' +
                    'from your discard pile to this Pokemon.'
            }];
        this.attacks = [
            {
                name: 'Rainbow Burn',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'Does 20 more damage for each different type of basic Energy ' +
                    'attached to this Pokemon.'
            }
        ];
        this.set = 'DRX';
        this.name = 'Ho-Oh EX';
        this.fullName = 'Ho-Oh EX DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.REBIRTH_MAREKER = 'REBIRTH_MAREKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let basicEnergies = 0;
            const typeMap = {};
            player.active.cards.forEach(c => {
                if (c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.BASIC) {
                    const cardType = c.provides[0];
                    if (typeMap[cardType] === undefined) {
                        basicEnergies += 1;
                        typeMap[cardType] = true;
                    }
                }
            });
            effect.damage += basicEnergies * 20;
            return state;
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = useRebirth(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.REBIRTH_MAREKER, this)) {
            effect.player.marker.removeMarker(this.REBIRTH_MAREKER, this);
        }
        return state;
    }
}
exports.HoOhEx = HoOhEx;
