"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faba = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Faba extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.SUPPORTER;
        this.set = 'LOT';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '173';
        this.name = 'Faba';
        this.fullName = 'Faba LOT';
        this.text = 'Choose a Pokémon Tool or Special Energy card attached to 1 of your opponent\'s Pokémon, or any Stadium card in play, and put it in the Lost Zone.';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.TrainerEffect && effect.trainerCard === this) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.supporterTurn > 0) {
                throw new game_1.GameError(game_1.GameMessage.SUPPORTER_ALREADY_PLAYED);
            }
            let pokemonsWithTool = 0;
            const blocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.tool !== undefined) {
                    pokemonsWithTool += 1;
                }
                else {
                    blocked.push(target);
                }
            });
            let specialEnergy = 0;
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    specialEnergy += 1;
                }
            });
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (pokemonsWithTool === 0 && stadiumCard == undefined && specialEnergy === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            const toolOption = {
                message: game_1.GameMessage.CHOICE_TOOL,
                action: () => {
                    let targets = [];
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false, blocked }), results => {
                        targets = results || [];
                        if (targets.length === 0) {
                            return state;
                        }
                        const cardList = targets[0];
                        if (cardList.stage == card_types_1.Stage.BASIC) {
                            try {
                                const supporterEffect = new play_card_effects_1.SupporterEffect(player, effect.trainerCard);
                                store.reduceEffect(state, supporterEffect);
                            }
                            catch (_a) {
                                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                                return state;
                            }
                        }
                        targets.forEach(target => {
                            const owner = game_1.StateUtils.findOwner(state, target);
                            if (target.tool !== undefined) {
                                target.moveCardTo(target.tool, owner.lostzone);
                                target.tool = undefined;
                            }
                            player.supporter.moveCardTo(this, player.discard);
                            return state;
                        });
                        player.supporter.moveCardTo(this, player.discard);
                        return state;
                    });
                }
            };
            const stadiumOption = {
                message: game_1.GameMessage.CHOICE_STADIUM,
                action: () => {
                    const stadiumCard = game_1.StateUtils.getStadiumCard(state);
                    if (stadiumCard == undefined) {
                        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
                    }
                    // Discard Stadium
                    const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                    const owner = game_1.StateUtils.findOwner(state, cardList);
                    cardList.moveTo(owner.lostzone);
                    player.supporter.moveCardTo(this, player.discard);
                    return state;
                }
            };
            const specialEnergyBlocked = [];
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card, target) => {
                if (cardList.cards.some(c => c instanceof game_1.EnergyCard && c.energyType === card_types_1.EnergyType.SPECIAL)) {
                    return;
                }
                else {
                    specialEnergyBlocked.push(target);
                }
            });
            const specialEnergyOption = {
                message: game_1.GameMessage.CHOICE_SPECIAL_ENERGY,
                action: () => {
                    return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: false, blocked: specialEnergyBlocked }), results => {
                        if (results.length === 0) {
                            return state;
                        }
                        const target = results[0];
                        let cards = [];
                        state = store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_DISCARD, target, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.SPECIAL }, { min: 1, max: 1, allowCancel: false }), selected => {
                            cards = selected || [];
                            if (cards.length > 0) {
                                player.supporter.moveCardTo(effect.trainerCard, player.discard);
                                target.moveCardsTo(cards, opponent.lostzone);
                            }
                            return state;
                        });
                    });
                }
            };
            const options = [];
            if (pokemonsWithTool > 0) {
                options.push(toolOption);
            }
            if (specialEnergy > 0) {
                options.push(specialEnergyOption);
            }
            if (stadiumCard !== undefined) {
                options.push(stadiumOption);
            }
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.DISCARD_STADIUM_OR_TOOL_OR_SPECIAL_ENERGY, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (option.action) {
                    option.action();
                }
                player.supporter.moveCardTo(this, player.discard);
                return state;
            });
        }
        return state;
    }
}
exports.Faba = Faba;
