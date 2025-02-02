"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalarianMrRime = void 0;
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class GalarianMrRime extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Galarian Mr. Mime';
        this.cardType = W;
        this.hp = 120;
        this.weakness = [{ type: M }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Shuffle Dance',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn, you may switch 1 of your opponent\'s face-down Prize cards ' +
                    'with the top card of their deck. (The cards stay face down.)',
            }];
        this.attacks = [{
                name: 'Mad Party',
                cost: [W, C, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'This attack does 20 damage for each Pokémon in your discard pile that has the Mad Party attack.'
            }];
        this.regulationMark = 'D';
        this.set = 'DAA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '36';
        this.name = 'Galarian Mr. Rime';
        this.fullName = 'Galarian Mr. Rime DAA';
        this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
        this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizes = opponent.prizes.filter(p => p.isSecret);
            if (prizes.length === 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            // Keep track of which prizes were originally face down
            const originallyFaceDown = opponent.prizes.map(p => p.isSecret);
            // Make prizes no more secret, before displaying prompt
            prizes.forEach(p => { p.isSecret = true; });
            const allPrizeCards = new game_1.CardList();
            allPrizeCards.isSecret = true;
            allPrizeCards.isPublic = false;
            allPrizeCards.faceUpPrize = false;
            prizes.forEach(prizeList => {
                allPrizeCards.cards.push(...prizeList.cards);
            });
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, allPrizeCards, {}, { min: 1, max: 1, allowCancel: false, isSecret: true }), chosenPrize => {
                const prizeCard = chosenPrize[0];
                const deck = opponent.deck;
                const temp = new game_1.CardList();
                deck.moveTo(temp, 1);
                // Find the prize list containing the chosen card
                const chosenPrizeList = opponent.prizes.find(prizeList => prizeList.cards.includes(prizeCard));
                if (chosenPrizeList) {
                    const temp2 = new game_1.CardList();
                    chosenPrizeList.moveCardTo(prizeCard, temp2);
                    temp2.moveToTopOfDestination(deck);
                    temp.moveTo(chosenPrizeList, 1);
                }
                // At the end, when resetting prize cards:
                opponent.prizes.forEach((p, index) => {
                    if (originallyFaceDown[index]) {
                        p.isSecret = true;
                    }
                });
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            let pokemonCount = 0;
            player.discard.cards.forEach(c => {
                if (c instanceof game_1.PokemonCard && c.attacks.some(a => a.name === 'Mad Party'))
                    pokemonCount += 1;
            });
            effect.damage = pokemonCount * 20;
        }
        return state;
    }
}
exports.GalarianMrRime = GalarianMrRime;
