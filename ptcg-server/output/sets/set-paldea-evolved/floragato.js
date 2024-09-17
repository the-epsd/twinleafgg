"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floragato = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Floragato extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sprigatito';
        this.cardType = game_1.CardType.GRASS;
        this.hp = 90;
        this.retreat = [game_1.CardType.COLORLESS];
        this.weakness = [{ type: game_1.CardType.FIRE }];
        this.attacks = [
            {
                name: 'Seed Bomb',
                cost: [game_1.CardType.GRASS],
                damage: 30,
                text: ''
            },
            {
                name: 'Magic Whip',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 50,
                text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
            }
        ];
        this.set = 'PAL';
        this.name = 'Floragato';
        this.fullName = 'Floragato PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.regulationMark = 'G';
        this.magicWhip = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            this.magicWhip = true;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && this.magicWhip == true) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            state = store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                if (result) {
                    if (result.length > 0) {
                        opponent.active.clearEffects();
                        opponent.switchPokemon(result[0]);
                        this.magicWhip = false;
                        return state;
                    }
                }
            });
        }
        return state;
    }
}
exports.Floragato = Floragato;
