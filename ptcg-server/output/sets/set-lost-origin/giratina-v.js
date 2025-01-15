"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiratinaV = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const card_list_1 = require("../../game/store/state/card-list");
const choose_cards_prompt_1 = require("../../game/store/prompts/choose-cards-prompt");
const game_message_1 = require("../../game/game-message");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class GiratinaV extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.regulationMark = 'F';
        this.cardType = card_types_1.CardType.DRAGON;
        this.hp = 220;
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Abyss Seeking',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Look at the top 4 cards of your deck and put 2 of them into your hand. Put the other cards in the Lost Zone.'
            },
            {
                name: 'Shred',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 160,
                shredAttack: true,
                text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '130';
        this.name = 'Giratina V';
        this.fullName = 'Giratina V LOR';
        this.FLOWER_SELECTING_MARKER = 'FLOWER_SELECTING_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const deckTop = new card_list_1.CardList();
            player.deck.moveTo(deckTop, 4);
            return store.prompt(state, new choose_cards_prompt_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, deckTop, {}, { min: 2, max: 2, allowCancel: true }), selected => {
                deckTop.moveCardsTo(selected, player.hand);
                deckTop.moveTo(player.lostzone);
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const dealDamage = new attack_effects_1.DealDamageEffect(effect, 160);
            store.reduceEffect(state, dealDamage);
            const applyWeakness = new attack_effects_1.ApplyWeaknessEffect(effect, dealDamage.damage);
            store.reduceEffect(state, applyWeakness);
            const damage = applyWeakness.damage;
            effect.damage = 0;
            if (damage > 0) {
                opponent.active.damage += damage;
                const afterDamage = new attack_effects_1.AfterDamageEffect(effect, damage);
                state = store.reduceEffect(state, afterDamage);
            }
        }
        return state;
    }
}
exports.GiratinaV = GiratinaV;
