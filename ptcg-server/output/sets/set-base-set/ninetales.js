"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ninetales = void 0;
const __1 = require("../..");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const choose_pokemon_prompt_1 = require("../../game/store/prompts/choose-pokemon-prompt");
class Ninetales extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'BS';
        this.name = 'Ninetales';
        this.evolvesFrom = 'Vulpix';
        this.fullName = 'Ninetales BS';
        this.stage = card_types_1.Stage.STAGE_1;
        this.cardType = card_types_1.CardType.FIRE;
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '12';
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [];
        this.attacks = [{
                name: 'Lure',
                damage: 0,
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
            }, {
                name: 'Fire Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 80,
                text: 'Discard 1 {R} Energy card attached to Ninetales in order to use this attack.'
            }];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const opponent = __1.StateUtils.getOpponent(state, effect.player);
            if (opponent.bench.some(b => b.cards.length > 0)) {
                return store.prompt(state, new choose_pokemon_prompt_1.ChoosePokemonPrompt(effect.player.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.TOP_PLAYER, [__1.SlotType.BENCH]), ([bench]) => {
                    opponent.switchPokemon(bench);
                });
            }
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, card_types_1.CardType.FIRE, 1);
        }
        return state;
    }
}
exports.Ninetales = Ninetales;
