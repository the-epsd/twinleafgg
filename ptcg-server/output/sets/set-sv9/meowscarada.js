"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowscarada = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Meowscarada extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_2;
        this.evolvesFrom = 'Floragato';
        this.cardType = G;
        this.hp = 160;
        this.weakness = [{ type: R }];
        this.retreat = [C];
        this.powers = [{
                name: 'Showtime',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon.',
            }];
        this.attacks = [{
                name: 'Rising Bloom',
                cost: [C, C],
                damage: 90,
                damageCalculation: '+',
                text: 'If your opponent\'s Active Pokémon is a Pokémon ex, this attack does 90 more damage.'
            }];
        this.regulationMark = 'I';
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.name = 'Meowscarada';
        this.fullName = 'Meowscarada SV9';
        this.SHOWTIME_MARKER = 'SHOWTIME_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.marker.hasMarker(this.SHOWTIME_MARKER, this)) {
                throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
            }
            let bench;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (card === this && target.slot === game_1.SlotType.BENCH) {
                    bench = cardList;
                }
            });
            if (bench === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.marker.addMarker(this.SHOWTIME_MARKER, this);
            player.switchPokemon(bench);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentActive = opponent.active.getPokemonCard();
            if (opponentActive.tags.includes(game_1.CardTag.POKEMON_ex)) {
                effect.damage += 90;
            }
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            effect.player.marker.removeMarker(this.SHOWTIME_MARKER, this);
        }
        return state;
    }
}
exports.Meowscarada = Meowscarada;
