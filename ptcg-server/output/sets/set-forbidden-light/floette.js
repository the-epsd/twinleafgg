"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floette = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useSwirlingPetals(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const benchCount = opponent.bench.reduce((sum, b) => {
        return sum + (b.cards.length > 0 ? 1 : 0);
    }, 0);
    if (benchCount > 0) {
        return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
            if (!targets || targets.length === 0) {
                return;
            }
            opponent.active.clearEffects();
            opponent.switchPokemon(targets[0]);
            next();
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            let target = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                target = results || [];
                next();
                if (target.length === 0) {
                    return state;
                }
                // Discard trainer only when user selected a Pokemon
                player.active.clearEffects();
                player.switchPokemon(target[0]);
                return state;
            });
        });
    }
}
class Floette extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = Y;
        this.hp = 70;
        this.weakness = [{ type: M }];
        this.resistance = [{ type: D, value: -20 }];
        this.retreat = [C];
        this.evolvesFrom = 'Flabébé';
        this.attacks = [{
                name: 'Swirling Petals',
                cost: [Y],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.set = 'FLI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '85';
        this.name = 'Floette';
        this.fullName = 'Floette FLI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useSwirlingPetals(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Floette = Floette;
