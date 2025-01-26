"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umbreonex = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Umbreonex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Eevee';
        this.cardType = D;
        this.hp = 280;
        this.retreat = [C, C];
        this.weakness = [{ type: G }];
        this.attacks = [
            {
                name: 'Moon Mirage',
                cost: [D, C, C],
                damage: 160,
                text: 'Your opponent\'s Active Pokémon is now Confused.',
            },
            {
                name: 'Onyx',
                cost: [L, P, D],
                damage: 0,
                text: 'Discard all Energy from this Pokémon, and take a Prize card.',
            }
        ];
        this.regulationMark = 'H';
        this.set = 'PRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '60';
        this.name = 'Umbreon ex';
        this.fullName = 'Umbreon ex SV8a';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.CONFUSED]);
            store.reduceEffect(state, specialConditionEffect);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            // const opponent = StateUtils.getOpponent(state, player);
            const prizes = player.prizes.filter(p => p.isSecret);
            if (prizes.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            const cards = [];
            prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });
            // const blocked: number[] = [];
            // player.prizes.forEach((p, index) => {
            //   if (p.faceUpPrize) {
            //     blocked.push(index);
            //   }
            //   if (p.isPublic) {
            //     blocked.push(index);
            //   }
            //   if (!p.isSecret) {
            //     blocked.push(index);
            //   }
            // });
            // Keep track of which prizes were originally face down
            const originallyFaceDown = player.prizes.map(p => p.isSecret);
            // Make prizes no more secret, before displaying prompt
            prizes.forEach(p => { p.isSecret = true; });
            // state = store.prompt(state, new ChoosePrizePrompt(
            //   player.id,
            //   GameMessage.CHOOSE_POKEMON,
            //   { count: 1, blocked: blocked, allowCancel: true },
            // ), chosenPrize => {
            const allPrizeCards = new game_1.CardList();
            player.prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, allPrizeCards, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), chosenPrize => {
                // if (chosenPrize === null || chosenPrize.length === 0) {
                //   player.prizes.forEach((p, index) => {
                //     if (originallyFaceDown[index]) {
                //       p.isSecret = true;
                //     }
                //   });
                //   player.supporter.moveCardTo(effect.trainerCard, player.discard);
                //   const faceDownPrizes = player.prizes.filter((p, index) => originallyFaceDown[index]);
                //   this.shuffleFaceDownPrizeCards(faceDownPrizes);
                //   return state;
                // }
                const prizePokemon = chosenPrize[0];
                const hand = player.hand;
                // Find the prize list containing the chosen card
                const chosenPrizeList = player.prizes.find(prizeList => prizeList.cards.includes(prizePokemon));
                // if (chosenPrize.length > 0) {
                //   state = store.prompt(state, new ShowCardsPrompt(
                //     opponent.id,
                //     GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                //     chosenPrize
                //   ), () => { });
                // }
                if (chosenPrizeList) {
                    chosenPrizeList.moveCardTo(prizePokemon, hand);
                }
                // At the end, when resetting prize cards:
                player.prizes.forEach((p, index) => {
                    if (originallyFaceDown[index]) {
                        p.isSecret = true;
                    }
                });
                // Shuffle only the face-down prize cards
                const faceDownPrizes = player.prizes.filter((p, index) => originallyFaceDown[index]);
                this.shuffleFaceDownPrizeCards(faceDownPrizes);
                return state;
            });
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
    shuffleFaceDownPrizeCards(array) {
        const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);
        for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = faceDownPrizeCards[i];
            faceDownPrizeCards[i] = faceDownPrizeCards[j];
            faceDownPrizeCards[j] = temp;
        }
        const prizePositions = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i].cards.length === 0 || !array[i].isSecret) {
                prizePositions.push(array[i]);
                continue;
            }
            prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
        }
        return prizePositions;
    }
}
exports.Umbreonex = Umbreonex;
