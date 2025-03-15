"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArvensToedscruel = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class ArvensToedscruel extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'I';
        this.tags = [card_types_1.CardTag.ARVENS];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Arven\'s Toedscool';
        this.cardType = F;
        this.hp = 140;
        this.weakness = [{ type: G }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Pull',
                cost: [C],
                damage: 0,
                text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot.'
            },
            {
                name: 'Reckless Charge',
                cost: [C, C, C],
                damage: 120,
                text: 'This Pokémon also does 30 damage to itself.'
            },
        ];
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '48';
        this.name = 'Arven\'s Toedscruel';
        this.fullName = 'Arven\'s Toedscruel SV9a';
    }
    reduceEffect(store, state, effect) {
        // Pull
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                opponent.switchPokemon(result[0]);
            });
        }
        // Reckless Charge
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
        }
        return state;
    }
}
exports.ArvensToedscruel = ArvensToedscruel;
