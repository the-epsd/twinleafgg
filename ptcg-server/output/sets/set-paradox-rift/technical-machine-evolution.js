"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechnicalMachineEvolution = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const trainer_card_1 = require("../../game/store/card/trainer-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class TechnicalMachineEvolution extends trainer_card_1.TrainerCard {
    constructor() {
        super(...arguments);
        this.trainerType = card_types_1.TrainerType.TOOL;
        this.regulationMark = 'G';
        this.tags = [];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '178';
        this.name = 'Technical Machine: Evolution';
        this.fullName = 'Technical Machine: Evolution PAR';
        this.attacks = [{
                name: 'Evolution',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Choose up to 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a card that evolves from that Pokémon and put it onto that Pokémon to evolve it. Then, shuffle your deck.'
            }];
        this.text = 'The Pokémon this card is attached to can use the attack on this card. (You still need the necessary Energy to use this attack.) If this card is attached to 1 of your Pokémon, discard it at the end of your turn.';
    }
    reduceEffect(store, state, effect) {
        var _a;
        if (effect instanceof check_effects_1.CheckPokemonAttacksEffect && ((_a = effect.player.active.getPokemonCard()) === null || _a === void 0 ? void 0 : _a.tools.includes(this)) &&
            !effect.attacks.includes(this.attacks[0])) {
            effect.attacks.push(this.attacks[0]);
        }
        function isMatchingStage2(stage1, basic, stage2) {
            for (const card of stage1) {
                if (card.name === stage2.evolvesFrom && basic.name === card.evolvesFrom) {
                    return true;
                }
            }
            return false;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Create list of non - Pokemon SP slots
            const blocked = [];
            let hasBasicPokemon = false;
            const stage2 = player.deck.cards.filter(c => {
                return c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2;
            });
            //   if (stage2.length === 0) {
            //     throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
            //   }
            // Look through all known cards to find out if it's a valid Stage 2
            const cm = game_1.CardManager.getInstance();
            const stage1 = cm.getAllCards().filter(c => {
                return c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_1;
            });
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (list, card, target) => {
                if (card.stage === card_types_1.Stage.BASIC && stage2.some(s => isMatchingStage2(stage1, card, s))) {
                    const playedTurnEffect = new check_effects_1.CheckPokemonPlayedTurnEffect(player, list);
                    store.reduceEffect(state, playedTurnEffect);
                    if (playedTurnEffect.pokemonPlayedTurn < state.turn) {
                        hasBasicPokemon = true;
                        return;
                    }
                    if (playedTurnEffect.pokemonPlayedTurn > state.turn) {
                        hasBasicPokemon = true;
                        return;
                    }
                    if (playedTurnEffect.pokemonPlayedTurn == state.turn) {
                        hasBasicPokemon = true;
                        return;
                    }
                }
                blocked.push(target);
            });
            if (!hasBasicPokemon) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let targets = [];
            store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_EVOLVE, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: true, blocked }), selection => {
                targets = selection || [];
            });
            if (targets.length === 0) {
                return state; // canceled by user
            }
            const pokemonCard = targets[0].getPokemonCard();
            if (pokemonCard === undefined) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            const blocked2 = [];
            player.deck.cards.forEach((c, index) => {
                if (c instanceof game_1.PokemonCard && c.stage === card_types_1.Stage.STAGE_2) {
                    if (!isMatchingStage2(stage1, pokemonCard, c)) {
                        blocked2.push(index);
                    }
                }
            });
            let cards = [];
            return store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_EVOLVE, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.STAGE_2 }, { allowCancel: true, blocked: blocked2 }), selected => {
                cards = selected || [];
                if (cards.length > 0) {
                    const pokemonCard = cards[0];
                    const evolveEffect = new game_effects_1.EvolveEffect(player, targets[0], pokemonCard);
                    store.reduceEffect(state, evolveEffect);
                }
            });
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.active.tool) {
            const player = effect.player;
            const tool = effect.player.active.tool;
            if (tool.name === this.name) {
                player.active.moveCardTo(tool, player.discard);
                player.active.tool = undefined;
            }
            return state;
        }
        return state;
    }
}
exports.TechnicalMachineEvolution = TechnicalMachineEvolution;
