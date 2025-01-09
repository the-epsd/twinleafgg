"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spiritomb = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Spiritomb extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 60;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Building Spite',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), you may put 1 damage counter on this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Anguish Cry',
                cost: [card_types_1.CardType.DARK],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '112';
        this.name = 'Spiritomb';
        this.fullName = 'Spiritomb UNB';
        this.BUILDING_SPITE_MARKER = 'BUILDING_SPITE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.BUILDING_SPITE_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.BUILDING_SPITE_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 10;
                }
            });
            player.marker.addMarker(this.BUILDING_SPITE_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get Spiritomb's damage
            const spiritombDamage = effect.player.active.damage;
            // Calculate 30 damage per counter
            const damagePerCounter = 30;
            effect.damage += (spiritombDamage * damagePerCounter / 10);
            return state;
        }
        return state;
    }
}
exports.Spiritomb = Spiritomb;
