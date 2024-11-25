"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toxicroakex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Toxicroakex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Croagunk';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Nasty Plot',
                cost: [card_types_1.CardType.DARK],
                damage: 0,
                text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
            },
            {
                name: 'Toxic Ripper',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 120,
                text: 'Your opponent\'s Active Pokémon is now Poisoned. During Pokémon Checkup, put 6 damage counters on that Pokémon instead of 1.'
            }
        ];
        this.set = 'SVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Toxicroak ex';
        this.fullName = 'Toxicroak ex SVI';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length == 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, {}, { min: 1, max: 2, allowCancel: false }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                state = store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
            specialCondition.poisonDamage = 60;
            store.reduceEffect(state, specialCondition);
        }
        return state;
    }
}
exports.Toxicroakex = Toxicroakex;
