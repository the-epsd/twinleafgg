"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SylveonGX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_2 = require("../../game");
const game_3 = require("../../game");
const state_utils_1 = require("../../game/store/state-utils");
const game_effects_1 = require("../../game/store/effects/game-effects");
// GRI Sylveon-GX 92 (https://limitlesstcg.com/cards/GRI/92)
class SylveonGX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_GX];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = card_types_1.CardType.FAIRY;
        this.hp = 200;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.resistance = [{ type: card_types_1.CardType.DARK, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Magical Ribbon',
                cost: [card_types_1.CardType.FAIRY],
                damage: 0,
                text: 'Search your deck for up to 3 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Fairy Wind',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 110,
                text: ''
            },
            {
                name: 'Plea-GX',
                cost: [card_types_1.CardType.FAIRY, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put 2 of your opponent\'s Benched Pokémon and all cards attached to them into your opponent\'s hand. (You can\'t use more than 1 GX attack in a game.)'
            }
        ];
        this.set = 'GRI';
        this.setNumber = '92';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Sylveon-GX';
        this.fullName = 'Sylveon-GX GRI';
    }
    reduceEffect(store, state, effect) {
        // Magical Ribbon
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let cards = [];
            return store.prompt(state, new game_2.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 0, max: 3, allowCancel: false }), selected => {
                cards = selected || [];
                player.deck.moveCardsTo(cards, player.hand);
                store.prompt(state, new game_3.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        // Plea-GX
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[2]) {
            const player = effect.player;
            const opponent = state_utils_1.StateUtils.getOpponent(state, player);
            // Check if player has used GX attack
            if (player.usedGX == true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_GX_USED);
            }
            // set GX attack as used for game
            player.usedGX = true;
            const hasBenched = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 2, allowCancel: false }), selection => {
                selection.forEach(r => {
                    r.moveTo(opponent.hand);
                    r.clearEffects();
                });
            });
        }
        return state;
    }
}
exports.SylveonGX = SylveonGX;
