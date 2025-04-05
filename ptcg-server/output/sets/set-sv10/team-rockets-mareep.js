"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRocketsMareep = void 0;
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class TeamRocketsMareep extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.BASIC;
        this.tags = [game_1.CardTag.TEAM_ROCKET];
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Provision',
                cost: [C],
                damage: 0,
                text: 'Search your deck for an Item card, reveal it, and put it into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Petibolt',
                cost: [L],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '34';
        this.name = 'Team Rocket\'s Mareep';
        this.fullName = 'Team Rocket\'s Mareep SV10';
    }
    reduceEffect(store, state, effect) {
        // Provision
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                return state;
            }
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: game_1.SuperType.TRAINER, trainerType: game_1.TrainerType.ITEM }, { min: 0, max: 1, allowCancel: false, differentTypes: true }), selected => {
                cards = selected || [];
                if (selected.length === 0) {
                    return state;
                }
                prefabs_1.SHOW_CARDS_TO_PLAYER(store, state, effect.opponent, cards);
                prefabs_1.MOVE_CARDS_TO_HAND(store, state, player, selected);
                prefabs_1.SHUFFLE_DECK(store, state, player);
            });
        }
        return state;
    }
}
exports.TeamRocketsMareep = TeamRocketsMareep;
