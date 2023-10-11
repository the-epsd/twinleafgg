"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MewV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class MewV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_V, card_types_1.CardTag.FUSION_STRIKE];
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 180;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [];
        this.attacks = [
            {
                name: 'Strafe',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                text: 'Search your deck for an Energy card and attach it to 1 of  ' +
                    'your Fusion Strike Pokémon. Then, shuffle your deck.'
            }, {
                name: 'Psychic Leap',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: 'You may shuffle this Pokémon and all attached cards into your deck.'
            }
        ];
        this.set = 'FST';
        this.set2 = 'fusionstrike';
        this.setNumber = '113';
        this.name = 'Mew V';
        this.fullName = 'Mew V FST 113';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ConfirmPrompt(player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    player.active.moveTo(player.deck);
                    player.active.clearEffects();
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                        return state;
                    });
                }
                else {
                    return state;
                }
            });
        }
        return state;
    }
}
exports.MewV = MewV;
