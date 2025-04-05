"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pachirisu = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Pachirisu extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = L;
        this.hp = 60;
        this.weakness = [{ type: F }];
        this.resistance = [{ type: M, value: -20 }];
        this.retreat = [C];
        this.powers = [{
                name: 'Self-Generation',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Pachirisu from your hand onto your Bench, you may attach up to 2 [L] Energy cards from your hand to Pachirisu.'
            }];
        this.attacks = [
            {
                name: 'Shocking Bolt',
                cost: [L, L],
                damage: 50,
                text: 'Put all Energy cards attached to Pachirisu in the Lost Zone.'
            }
        ];
        this.set = 'CL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '18';
        this.name = 'Pachirisu';
        this.fullName = 'Pachirisu CL';
    }
    reduceEffect(store, state, effect) {
        if ((effect instanceof play_card_effects_1.PlayPokemonEffect) && effect.pokemonCard === this) {
            const player = effect.player;
            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.POKEPOWER,
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
                            && c.provides.includes(card_types_1.CardType.LIGHTNING);
                    });
                    if (!hasEnergyInHand) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
                    }
                    const cardList = game_1.StateUtils.findCardList(state, this);
                    if (cardList === undefined) {
                        return state;
                    }
                    return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.hand, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Lightning Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                        cards = cards || [];
                        if (cards.length > 0) {
                            player.hand.moveCardsTo(cards, cardList);
                        }
                    });
                }
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (!(cardList instanceof game_1.PokemonCardList))
                throw new game_1.GameError(game_1.GameMessage.INVALID_TARGET);
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = checkProvidedEnergy.energyMap.map(e => e.card);
            cards.forEach(card => {
                cardList.moveCardTo(card, player.lostzone);
            });
        }
        return state;
    }
}
exports.Pachirisu = Pachirisu;
