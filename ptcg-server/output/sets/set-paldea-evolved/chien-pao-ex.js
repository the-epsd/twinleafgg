"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChienPaoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const discard_energy_prompt_1 = require("../../game/store/prompts/discard-energy-prompt");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class ChienPaoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
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
                damageCalculation: 'x',
                text: 'You may discard any amount of W Energy from your ' +
                    'Pokémon. This attack does 60 damage for each card you ' +
                    'discarded in this way.'
            }
        ];
        this.set = 'PAL';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Chien-Pao ex';
        this.fullName = 'Chien-Pao ex PAL';
        this.SHIVERY_CHILL_MARKER = 'SHIVERY_CHILL_MARKER';
    }
    // Implement power
    reduceEffect(store, state, effect) {
        if (effect instanceof game_phase_effects_1.EndTurnEffect) {
            const player = effect.player;
            player.marker.removeMarker(this.SHIVERY_CHILL_MARKER, this);
        }
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            player.marker.removeMarker(this.SHIVERY_CHILL_MARKER, this);
        }
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.active.cards[0] !== this) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.deck.cards.length === 0) {
                throw new game_1.GameError(game_message_1.GameMessage.CANNOT_USE_POWER);
            }
            if (player.marker.hasMarker(this.SHIVERY_CHILL_MARKER, this)) {
                throw new game_1.GameError(game_message_1.GameMessage.POWER_ALREADY_USED);
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 0, max: 2, allowCancel: false }), cards => {
                player.marker.addMarker(this.SHIVERY_CHILL_MARKER, this);
                if (cards.length === 0) {
                    return state;
                }
                cards.forEach((card, index) => {
                    store.log(state, game_message_1.GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
                });
                if (cards.length > 0) {
                    state = store.prompt(state, new game_1.ShowCardsPrompt(opponent.id, game_message_1.GameMessage.CARDS_SHOWED_BY_THE_OPPONENT, cards), () => state);
                }
                player.deck.moveCardsTo(cards, player.hand);
                player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                    if (cardList.getPokemonCard() === this) {
                        cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                    }
                    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
                        player.deck.applyOrder(order);
                    });
                });
            });
        }
        //     if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        //       const player = effect.player;
        //       return store.prompt(state, new ChoosePokemonPrompt(
        //         player.id,
        //         GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        //         PlayerType.BOTTOM_PLAYER,
        //         [SlotType.ACTIVE, SlotType.BENCH],
        //         { min: 1, max: 6, allowCancel: false }
        //       ), targets => {
        //         targets.forEach(target => {
        //           return store.prompt(state, new ChooseCardsPrompt(
        //             player.id,
        //             GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        //             target, // Card source is target Pokemon
        //             { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        //             { allowCancel: false }
        //           ), selected => {
        //             const cards = selected || [];
        //             if (cards.length > 0) {
        //               let totalDiscarded = 0;
        //               const discardEnergy = new DiscardCardsEffect(effect, cards);
        //               discardEnergy.target = target;
        //               totalDiscarded += discardEnergy.cards.length;
        //               store.reduceEffect(state, discardEnergy);
        //               console.log('Total discarded:' + totalDiscarded);
        //               effect.damage += totalDiscarded * 60;
        //               console.log('Total Damage: ' + effect.damage);
        //               return state;
        //             }
        //           });
        //         });
        //         effect.damage -= 60;
        //         return state;
        //       });
        //     }
        //     return state;
        //   }
        // }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // return store.prompt(state, new ChoosePokemonPrompt(
            //   player.id,
            //   GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            //   PlayerType.BOTTOM_PLAYER,
            //   [SlotType.ACTIVE, SlotType.BENCH],
            //   { min: 1, max: 6, allowCancel: true }
            // ), targets => {
            //   targets.forEach(target => {
            let totalWaterEnergy = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList) => {
                const waterCount = cardList.cards.filter(card => card instanceof game_1.EnergyCard && card.name === 'Water Energy').length;
                totalWaterEnergy += waterCount;
            });
            console.log('Total Water Energy: ' + totalWaterEnergy);
            return store.prompt(state, new discard_energy_prompt_1.DiscardEnergyPrompt(player.id, game_message_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], // Card source is target Pokemon
            { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Water Energy' }, { min: 1, max: totalWaterEnergy, allowCancel: false }), transfers => {
                if (transfers === null) {
                    return;
                }
                for (const transfer of transfers) {
                    let totalDiscarded = 0;
                    const source = game_1.StateUtils.getTarget(state, player, transfer.from);
                    const target = player.discard;
                    source.moveCardTo(transfer.card, target);
                    totalDiscarded = transfers.length;
                    effect.damage = totalDiscarded * 60;
                }
                console.log('Total Damage: ' + effect.damage);
                return state;
            });
        }
        return state;
    }
}
exports.ChienPaoex = ChienPaoex;
