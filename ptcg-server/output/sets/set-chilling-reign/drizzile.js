"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drizzile = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Drizzile extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Sobble';
        this.tags = [game_1.CardTag.RAPID_STRIKE];
        this.cardType = game_1.CardType.WATER;
        this.hp = 90;
        this.weakness = [{ type: game_1.CardType.LIGHTNING }];
        this.resistance = [];
        this.retreat = [game_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bounce',
                cost: [game_1.CardType.COLORLESS, game_1.CardType.COLORLESS],
                damage: 40,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }
        ];
        this.regulationMark = 'E';
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '42';
        this.name = 'Drizzile';
        this.fullName = 'Drizzile CRE';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_NEW_ACTIVE_POKEMON, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), selected => {
                if (!selected || selected.length === 0) {
                    return state;
                }
                const target = selected[0];
                player.switchPokemon(target);
            });
        }
        return state;
    }
}
exports.Drizzile = Drizzile;
