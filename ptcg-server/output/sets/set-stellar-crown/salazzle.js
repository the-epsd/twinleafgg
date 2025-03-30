"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salazzle = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const costs_1 = require("../../game/store/prefabs/costs");
class Salazzle extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Salandit';
        this.cardType = R;
        this.hp = 120;
        this.weakness = [{ type: W }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Sudden Scorching',
                cost: [C, C],
                damage: 0,
                text: 'Your opponent discards a card from their hand. If this Pokémon evolved from Salandit during this turn, your opponent discards 2 more cards.'
            },
            {
                name: 'Flamethrower',
                cost: [R, C, C],
                damage: 130,
                text: 'Discard an Energy from this Pokémon.'
            }];
        this.set = 'SCR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '24';
        this.name = 'Salazzle';
        this.fullName = 'Salazzle SCR';
        this.SUDDEN_SCORCHING_MARKER = 'SUDDEN_SCORCHING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.JUST_EVOLVED(effect, this) && !prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
            const player = effect.player;
            prefabs_1.ADD_MARKER(this.SUDDEN_SCORCHING_MARKER, player, this);
        }
        prefabs_1.REMOVE_MARKER_AT_END_OF_TURN(effect, this.SUDDEN_SCORCHING_MARKER, this);
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const markerCount = prefabs_1.HAS_MARKER(this.SUDDEN_SCORCHING_MARKER, player, this) ? 3 : 1;
            if (opponent.hand.cards.length < markerCount) {
                const cards = opponent.hand.cards;
                opponent.hand.moveCardsTo(cards, player.discard);
                return state;
            }
            store.prompt(state, new game_1.ChooseCardsPrompt(opponent, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, opponent.hand, {}, { min: markerCount, max: markerCount, allowCancel: false }), selected => {
                const cards = selected || [];
                opponent.hand.moveCardsTo(cards, opponent.discard);
            });
            return state;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 1, this)) {
            costs_1.DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
        }
        return state;
    }
}
exports.Salazzle = Salazzle;
