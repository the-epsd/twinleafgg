"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beheeyem = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
class Beheeyem extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Elgyem';
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Psypunch',
                cost: [P],
                damage: 20,
                text: '',
            },
            {
                name: 'Mysterious Noise',
                cost: [C, C, C],
                damage: 90,
                text: 'Shuffle this Pokémon and all cards attached to it into your deck. Your opponent can\'t play any Item cards from their hand during their next turn.',
            }
        ];
        this.set = 'UNM';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '91';
        this.name = 'Beheeyem';
        this.fullName = 'Beheeyem UNM';
        this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.ADD_MARKER(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, opponent, this);
            attack_effects_1.SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
        }
        if (effect instanceof play_card_effects_1.PlayItemEffect) {
            const player = effect.player;
            if (prefabs_1.HAS_MARKER(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, player, this)) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_EFFECT);
            }
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
        return state;
    }
}
exports.Beheeyem = Beheeyem;
