"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianMoltres = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class GalarianMoltres extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'E';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Malevolent Charge',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may attach up to 2 [D] Energy cards from your hand to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Fiery Wrath',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 20,
                damageCalculation: '+',
                text: 'This attack does 50 more damage for each Prize card your ' +
                    'opponent has taken.'
            }
        ];
        this.set = 'EVS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '93';
        this.name = 'Galarian Moltres';
        this.fullName = 'Galarian Moltres EVS';
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
                            && c.provides.includes(card_types_1.CardType.DARK);
                    });
                    if (!hasEnergyInHand) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    if (cardList === undefined) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Darkness Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
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
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 50;
            effect.damage = 20 + (prizesTaken * damagePerPrize);
        }
        return state;
    }
}
exports.GalarianMoltres = GalarianMoltres;
