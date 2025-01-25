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
                damageMultiplier: 'x',
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
            const originallyFaceDown = player.prizes.map(p => p.isSecret);
            const validPrizeCards = new game_1.CardList();
            validPrizeCards.isPublic = false;
            validPrizeCards.isSecret = true;
            opponent.prizes.forEach(prizeList => {
                if (prizeList.isSecret)
                    validPrizeCards.cards.push(...prizeList.cards);
            });
            if (validPrizeCards.cards.length == 0)
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK, validPrizeCards, {}, { min: 1, max: 1, isSecret: true, allowCancel: false }), chosenPrize => {
                if (chosenPrize.length == 0)
                    return state;
                const prizeCard = chosenPrize[0];
                const deck = opponent.deck;
                const chosenPrizeList = opponent.prizes.find(prizeList => prizeList.cards.includes(prizeCard));
                if (chosenPrizeList) {
                    deck.moveTo(chosenPrizeList, 1);
                    chosenPrizeList.moveCardTo(prizeCard, deck);
                }
                // At the end, when resetting prize cards:
                opponent.prizes.forEach((p, index) => {
                    if (originallyFaceDown[index]) {
                        p.isSecret = true;
                    }
                });
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
