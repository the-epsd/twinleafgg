"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagingBoltex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class RagingBoltex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.ANCIENT];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DRAGON;
        this.cardTypez = card_types_1.CardType.RAGING_BOLT_EX;
        this.hp = 240;
        this.weakness = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Bursting Roar',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Discard your hand and draw 6 cards.'
            },
            {
                name: 'Bellowing Thunder',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.FIGHTING],
                damage: 70,
                damageCalculation: 'x',
                text: 'You may discard any amount of Basic Energy from your Pokémon. This attack does 70 damage for each card you discarded in this way.'
            }
        ];
        this.set = 'TEF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '123';
        this.name = 'Raging Bolt ex';
        this.fullName = 'Raging Bolt ex TEF';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.hand.moveTo(player.discard);
            player.deck.moveTo(player.hand, 6);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 6, allowCancel: false }), targets => {
                targets.forEach(target => {
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, target, // Card source is target Pokemon
                    { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { allowCancel: false }), selected => {
                        const cards = selected || [];
                        if (cards.length > 0) {
                            let totalDiscarded = 0;
                            targets.forEach(target => {
                                const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                                discardEnergy.target = target;
                                totalDiscarded += discardEnergy.cards.length;
                                effect.damage = totalDiscarded * 70;
                                store.reduceEffect(state, discardEnergy);
                            });
                            return state;
                        }
                    });
                });
                return state;
            });
        }
        return state;
    }
}
exports.RagingBoltex = RagingBoltex;
