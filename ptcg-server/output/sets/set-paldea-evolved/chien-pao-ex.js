"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChienPaoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
class ChienPaoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 220;
        this.weakness = [{ type: card_types_1.CardType.METAL }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Shivery Chill',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, if this Pokémon is in the Active ' +
                    'Spot, you may search your deck for up to 2 Basic [W] Energy ' +
                    'cards, reveal them, and put them into your hand. Then, ' +
                    'shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'Hail Blade',
                cost: [card_types_1.CardType.WATER, card_types_1.CardType.WATER],
                damage: 60,
                text: 'You may discard any amount of W Energy from your ' +
                    'Pokémon. This attack does 60 damage for each card you ' +
                    'discarded in this way.'
            }
        ];
        this.set = 'PAL';
        this.name = 'Chien-Pao ex';
        this.fullName = 'Chien-Pao ex PAL';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.active.cards[0] !== this) {
                return state; // Not active
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                player.deck.moveCardsTo(cards, player.hand);
                return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                    player.deck.applyOrder(order);
                });
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let hasPokemonWithEnergy = false;
            const blocked = [];
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c.superType === card_types_1.SuperType.ENERGY)) {
                    hasPokemonWithEnergy = true;
                }
                else {
                    blocked.push(target);
                }
            });
            if (!hasPokemonWithEnergy) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let targets = [];
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, allowCancel: false, blocked }), results => {
                targets = results || [];
                let cards = [];
                targets.forEach(target => {
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY }, { min: 0, max: 100, allowCancel: false }), selected => {
                        cards = cards.concat(selected);
                    });
                    return state;
                });
                state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                    if (wantToUse) {
                        return state;
                    }
                    const damage = cards.length * 60;
                    effect.damage = damage;
                    targets.forEach(target => {
                        target.moveCardsTo(cards, player.discard);
                    });
                    return state;
                });
            });
        }
        return state;
    }
}
exports.ChienPaoex = ChienPaoex;
