"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthansQuilava = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class EthansQuilava extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Ethan\'s Cyndaquil';
        this.tags = [game_1.CardTag.ETHANS];
        this.cardType = R;
        this.hp = 100;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.powers = [{
                name: 'Adventure Bound',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may search your deck for a Ethan\'s Adventure, reveal it, and put it into your hand. Then, shuffle your deck.'
            }];
        this.attacks = [{
                name: 'Combustion',
                cost: [R],
                damage: 40,
                text: ''
            }];
        this.regulationMark = 'I';
        this.set = 'SV9a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Ethan\'s Quilava';
        this.fullName = 'Ethan\'s Quilava SV9a';
        this.ADVENTURE_BOUND_MARKER = 'ADVENTURE_BOUND';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_POWER_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            prefabs_1.BLOCK_EFFECT_IF_MARKER(this.ADVENTURE_BOUND_MARKER, player, this);
            prefabs_1.BLOCK_IF_DECK_EMPTY(player);
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { name: 'Ethan\'s Adventure' }, { min: 0, max: 1 }), cards => {
                if (!cards || cards.length === 0) {
                    return state;
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
                cards.forEach(card => prefabs_1.MOVE_CARD_TO(state, card, player.hand));
                prefabs_1.ADD_MARKER(this.ADVENTURE_BOUND_MARKER, player, this);
                prefabs_1.ABILITY_USED(player, this);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.ADVENTURE_BOUND_MARKER, this);
        return state;
    }
}
exports.EthansQuilava = EthansQuilava;
