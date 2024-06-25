"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volcanion = void 0;
const game_1 = require("../../game");
const play_card_action_1 = require("../../game/store/actions/play-card-action");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const state_utils_1 = require("../../game/store/state-utils");
function* useFlareStarter(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    let max = 1;
    if (state.turn === 2) {
        max = 3;
    }
    yield store.prompt(state, new game_1.AttachEnergyPrompt(player.id, game_1.GameMessage.ATTACH_ENERGY_TO_BENCH, player.deck, play_card_action_1.PlayerType.BOTTOM_PLAYER, [play_card_action_1.SlotType.BENCH, play_card_action_1.SlotType.ACTIVE], { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Fire Energy' }, { allowCancel: false, min: 0, max }), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
            const target = state_utils_1.StateUtils.getTarget(state, player, transfer.to);
            player.deck.moveCardTo(transfer.card, target);
            next();
        }
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Volcanion extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Flare Starter',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Search your deck for a [R] Energy card and attach it to 1 of your Pokémon. If you go second and it\'s your first turn, instead search for up to 3 [R] Energy cards and attach them to your Pokémon in any way you like. Then, shuffle your deck.'
            }, {
                name: 'High-Heat Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 50,
                damageCalculation: '+',
                text: 'If you have at least 4 [R] Energy in play, this attack does 60 more damage.'
            }];
        this.set = 'UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '25';
        this.name = 'Volcanion';
        this.fullName = 'Volcanion UNB';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useFlareStarter(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let energyCount = 0;
            player.forEachPokemon(play_card_action_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(em => {
                    energyCount += em.provides.filter(cardType => {
                        return em.card.name == 'Fire Energy';
                    }).length;
                });
            });
            if (energyCount >= 4)
                effect.damage += 60;
            return state;
        }
        return state;
    }
}
exports.Volcanion = Volcanion;
