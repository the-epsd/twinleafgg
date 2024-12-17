"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crabominable = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Crabominable extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Crabrawler';
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Food Prep',
                useWhenInPlay: false,
                powerType: game_1.PowerType.ABILITY,
                text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
            }];
        this.attacks = [
            {
                name: 'Haymaker',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 250,
                text: 'During your next turn, this Pokémon can\'t use Haymaker.'
            }
        ];
        this.set = 'SCR';
        this.name = 'Crabominable';
        this.fullName = 'Crabominable SCR';
        this.setNumber = '42';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.HAYMAKER_MARKER_1 = 'HAYMAKER_MARKER_1';
        this.HAYMAKER_MARKER_2 = 'HAYMAKER_MARKER_2';
    }
    reduceEffect(store, state, effect) {
        // Food Prep
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            if (effect.player !== player || player.active.getPokemonCard() !== this) {
                return state;
            }
            // i love checking for ability lock woooo
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            let kofuCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.TrainerCard && c.name === 'Kofu') {
                    kofuCount += 1;
                }
            });
            const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
            effect.cost.splice(index, kofuCount);
            return state;
        }
        // Haymaker
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.HAYMAKER_MARKER_1, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
            player.marker.addMarker(this.HAYMAKER_MARKER_1, this);
        }
        // doing end of turn things with the markers
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HAYMAKER_MARKER_2, this)) {
            effect.player.marker.removeMarker(this.HAYMAKER_MARKER_1, this);
            effect.player.marker.removeMarker(this.HAYMAKER_MARKER_2, this);
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.HAYMAKER_MARKER_1, this)) {
            effect.player.marker.addMarker(this.HAYMAKER_MARKER_2, this);
        }
        return state;
    }
}
exports.Crabominable = Crabominable;
