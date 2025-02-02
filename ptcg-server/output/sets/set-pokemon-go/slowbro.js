"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slowbro = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Slowbro extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slowpoke';
        this.cardType = game_1.CardType.WATER;
        this.hp = 120;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.retreat = [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS, game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Tumbling Tackle',
                cost: [game_1.CardType.COLORLESS],
                damage: 20,
                text: 'Both Active Pokémon are now Asleep.'
            },
            {
                name: 'Twilight Inspiration',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 0,
                text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
            }
        ];
        this.set = 'PGO';
        this.regulationMark = 'F';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '20';
        this.name = 'Slowbro';
        this.fullName = 'Slowbro PGO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const active = opponent.active;
            active.addSpecialCondition(game_1.SpecialCondition.ASLEEP);
            player.active.addSpecialCondition(game_1.SpecialCondition.ASLEEP);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const prizes = player.prizes.filter(p => p.isSecret);
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            if (prizesTaken === 1) {
                state = store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON, { count: 2, allowCancel: true }), chosenPrize => {
                    if (chosenPrize === null || chosenPrize.length === 0) {
                        prizes.forEach(p => { p.isSecret = true; });
                        return state;
                    }
                    const prizePokemon = chosenPrize[0];
                    const prizePokemon2 = chosenPrize[1];
                    const hand = player.hand;
                    prizePokemon.moveTo(hand);
                    prizePokemon2.moveTo(hand);
                });
            }
        }
        return state;
    }
}
exports.Slowbro = Slowbro;
