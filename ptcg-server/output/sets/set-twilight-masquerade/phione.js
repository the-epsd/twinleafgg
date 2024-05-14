"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phione = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Phione extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Beckon',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Put a Supporter card from your discard pile into your hand.'
            },
            {
                name: 'Energy Press',
                cost: [card_types_1.CardType.WATER],
                damage: 20,
                text: 'This attack does 20 damage for each Energy attached to your opponent\'s Active Pokémon.'
            }
        ];
        this.regulationMark = 'H';
        this.set = 'SV5a';
        this.name = 'Phione';
        this.fullName = 'Phione SV5a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const itemCount = player.discard.cards.filter(c => {
                return c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.SUPPORTER;
            }).length;
            if (itemCount === 0) {
                return state;
            }
            const max = Math.min(1, itemCount);
            const min = max;
            return store.prompt(state, [
                new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.discard, { superType: card_types_1.SuperType.TRAINER, trainerType: card_types_1.TrainerType.SUPPORTER }, { min, max, allowCancel: false })
            ], selected => {
                const cards = selected || [];
                player.discard.moveCardsTo(cards, player.hand);
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, checkProvidedEnergyEffect);
            const energyCount = checkProvidedEnergyEffect.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage = energyCount * 20;
        }
        return state;
    }
}
exports.Phione = Phione;
