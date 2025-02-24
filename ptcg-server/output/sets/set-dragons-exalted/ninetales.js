"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Ninetales extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Vulpix';
        this.cardType = R;
        this.hp = 90;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Bright Look',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon, ' +
                    'you may switch 1 of your opponent\'s Benched Pokémon with his or her Active Pokémon.',
            }];
        this.attacks = [{
                name: 'Hexed Flame',
                cost: [R],
                damage: 20,
                damageCalculation: '+',
                text: 'Does 50 more damage for each Special Condition affecting the Defending Pokémon.'
            }];
        this.set = 'DRX';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '19';
        this.name = 'Ninetales';
        this.fullName = 'Ninetales DRX';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench || prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
                return state;
            }
            state = prefabs_1.CONFIRMATION_PROMPT(store, state, player, (wantToUse) => {
                if (!wantToUse) {
                    return;
                }
                state = store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                    const cardList = result[0];
                    opponent.switchPokemon(cardList);
                });
            }, game_1.GameMessage.WANT_TO_USE_ABILITY);
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const oppActive = opponent.active;
            oppActive.specialConditions.forEach(c => {
                effect.damage += 50;
            });
        }
        return state;
    }
}
exports.Ninetales = Ninetales;
