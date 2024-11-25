"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotomV = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class RotomV extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 190;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Instant Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may draw 3 cards. If you use this Ability, your turn ends.'
            }];
        this.attacks = [
            {
                name: 'Scrap Short',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.LIGHTNING],
                damage: 40,
                damageCalculation: '+',
                text: 'Put any number of Pokémon Tool cards from your discard pile in the Lost Zone. This attack does 40 more damage for each card you put in the Lost Zone in this way.'
            }
        ];
        this.set = 'LOR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Rotom V';
        this.fullName = 'Rotom V LOR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Prompt player to choose tools to send to lost zone 
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_DISCARD, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.TOOL }, { allowCancel: false, min: 0 }), cards => {
                cards = cards || [];
                if (cards.length === 0) {
                    return;
                }
                const discountTools = new attack_effects_1.DiscardCardsEffect(effect, cards);
                discountTools.target = player.active;
                store.reduceEffect(state, discountTools);
                player.discard.moveCardsTo(cards, player.lostzone);
                // Calculate damage
                const damage = cards.length * 40;
                effect.damage = damage;
                return state;
            });
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            player.deck.moveTo(player.hand, 3);
            const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
            return state;
        }
        return state;
    }
}
exports.RotomV = RotomV;
