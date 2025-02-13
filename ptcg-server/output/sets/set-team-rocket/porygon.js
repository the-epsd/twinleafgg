"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 40;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: P, value: -20 }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Conversion 1',
                cost: [C],
                damage: 0,
                text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than [C].'
            },
            {
                name: 'Psybeam',
                cost: [C, C, C],
                damage: 20,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
            }
        ];
        this.set = 'TR';
        this.setNumber = '48';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Porygon';
        this.fullName = 'Porygon TR';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Conversion 1
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (((_a = opponent.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.weakness) === undefined) {
                return state;
            }
            const options = [
                { value: card_types_1.CardType.DARK, message: 'Dark' },
                { value: card_types_1.CardType.DRAGON, message: 'Dragon' },
                { value: card_types_1.CardType.FAIRY, message: 'Fairy' },
                { value: card_types_1.CardType.FIGHTING, message: 'Fighting' },
                { value: card_types_1.CardType.FIRE, message: 'Fire' },
                { value: card_types_1.CardType.GRASS, message: 'Grass' },
                { value: card_types_1.CardType.LIGHTNING, message: 'Lightning' },
                { value: card_types_1.CardType.METAL, message: 'Metal' },
                { value: card_types_1.CardType.PSYCHIC, message: 'Psychic' },
                { value: card_types_1.CardType.WATER, message: 'Water' }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_TYPE, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (!option) {
                    return state;
                }
                const oppActive = opponent.active.getPokemonCard();
                if (oppActive) {
                    oppActive.weakness = [{ type: option.value }];
                }
            });
        }
        // Psybeam
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            prefabs_1.COIN_FLIP_PROMPT(store, state, effect.player, result => {
                if (result) {
                    prefabs_1.ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
                }
            });
        }
        return state;
    }
}
exports.Porygon = Porygon;
