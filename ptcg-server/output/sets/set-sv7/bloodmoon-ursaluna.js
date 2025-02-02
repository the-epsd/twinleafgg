"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloodmoonUrsaluna = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class BloodmoonUrsaluna extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'H';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 150;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Ground Rule',
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, when you play this card from your hand onto your bench, you may attach up to 2 Basic Fighting Energy cards from your hand to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Mad Mud Bite',
                cost: [card_types_1.CardType.FIGHTING, card_types_1.CardType.FIGHTING, card_types_1.CardType.COLORLESS],
                damage: 100,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each damage counter on your opponent\'s Active Pokémon.'
            }
        ];
        this.set = 'SV6a';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Bloodmoon Ursaluna';
        this.fullName = 'Bloodmoon Ursaluna SV6a';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayPokemonEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            state = store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const hasEnergyInHand = player.hand.cards.some(c => {
                        return c instanceof game_1.EnergyCard
                            && c.energyType === card_types_1.EnergyType.BASIC
                            && c.provides.includes(card_types_1.CardType.FIGHTING);
                    });
                    if (!hasEnergyInHand) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    if (cardList === undefined) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fighting Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                        cards = cards || [];
                        if (cards.length > 0) {
                            player.hand.moveCardsTo(cards, cardList);
                        }
                    });
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0) {
                const damage = 100 + (opponent.active.damage * 3);
                effect.damage = damage;
                console.log(damage);
            }
        }
        return state;
    }
}
exports.BloodmoonUrsaluna = BloodmoonUrsaluna;
