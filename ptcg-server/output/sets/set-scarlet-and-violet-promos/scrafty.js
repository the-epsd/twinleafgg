"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrafty = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Scrafty extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Scraggy';
        this.cardType = D;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Nab \'n Dash',
                cost: [C],
                damage: 0,
                text: 'Search your deck for a number of cards up to the number of your Benched Pokémon and put them into your hand. Then, shuffle your deck.'
            }, {
                name: 'High Jump Kick',
                cost: [D, C, C],
                damage: 100,
                text: ''
            }];
        this.regulationMark = 'H';
        this.set = 'SVP';
        this.setNumber = '188';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Scrafty';
        this.fullName = 'Scrafty SVP';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            let cards = [];
            const benched = player.bench.filter(b => b.cards.length > 0).length;
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: benched, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        return state;
    }
}
exports.Scrafty = Scrafty;
