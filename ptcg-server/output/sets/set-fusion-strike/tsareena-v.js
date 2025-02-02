"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsareenaV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class TsareenaV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = G;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.hp = 200;
        this.weakness = [{ type: R }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Queen\'s Orders',
                cost: [G, C],
                damage: 20,
                damageCalculation: '+',
                text: 'You may discard any number of your Benched Pokémon. ' +
                    'This attack does 40 more damage for each Benched Pokémon you discarded in this way.'
            },
        ];
        this.regulationMark = 'E';
        this.set = 'FST';
        this.name = 'Tsareena V';
        this.fullName = 'Tsareena V FST';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '21';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Player has more Pokemons than bench size, discard some
            const count = player.bench.length;
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { min: 0, max: count, allowCancel: false }), results => {
                results = results || [];
                let discardCount = 0;
                // Discard all selected Pokemon
                for (let i = player.bench.length - 1; i >= 0; i--)
                    if (results.includes(player.bench[i])) {
                        player.bench[i].moveTo(player.discard);
                        discardCount++;
                    }
                effect.damage += (40 * discardCount);
            });
        }
        return state;
    }
}
exports.TsareenaV = TsareenaV;
