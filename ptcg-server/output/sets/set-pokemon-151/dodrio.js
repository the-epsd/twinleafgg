"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dodrio = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Dodrio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Doduo';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Zooming Draw',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn, you may put 1 damage counter on this Pokémon. If you do, draw a card.'
            }];
        this.attacks = [
            {
                name: 'Balliastic Beak',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each damage counter on this Pokémon.'
            }
        ];
        this.set = 'MEW';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Dodrio';
        this.fullName = 'Dodrio MEW';
        this.ZOOMING_DRAW_MARKER = 'ZOOMING_DRAW_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.ZOOMING_DRAW_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.ZOOMING_DRAW_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.damage += 10;
                }
            });
            player.deck.moveTo(player.hand, 1);
            player.marker.addMarker(this.ZOOMING_DRAW_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            // Get Dodrio's damage
            const dodrioDamage = effect.player.active.damage;
            // Calculate 30 damage per counter
            const damagePerCounter = 30;
            effect.damage += (dodrioDamage * damagePerCounter / 10);
            return state;
        }
        return state;
    }
}
exports.Dodrio = Dodrio;
