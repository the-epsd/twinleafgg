"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chansey = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Chansey extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 110;
        this.weakness = [{ type: F }];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Lucky Bonus',
                powerType: game_1.PowerType.ABILITY,
                exemptFromAbilityLock: true,
                text: 'If you took this Pokémon as a face-down Prize card during your turn and your Bench isn\'t full, ' +
                    'before you put it into your hand, you may put it onto your Bench. If you put this Pokémon onto your ' +
                    'Bench in this way, flip a coin. If heads, take 1 more Prize card.'
            }];
        this.attacks = [{
                name: 'Gentle Slap',
                cost: [C, C, C],
                damage: 70,
                text: ''
            }];
        this.set = 'MEW';
        this.setNumber = '113';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Chansey';
        this.fullName = 'Chansey MEW';
        this.abilityUsed = false;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.DrawPrizesEffect) {
            const generator = this.handlePrizeEffect(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
    *handlePrizeEffect(next, store, state, effect) {
        const player = effect.player;
        const prizeCard = effect.prizes.find(cardList => cardList.cards.includes(this));
        // Check if ability conditions are met
        if (!prizeCard || prefabs_1.GET_PLAYER_BENCH_SLOTS(player).length === 0 || !prizeCard.isSecret || effect.destination !== player.hand) {
            return state;
        }
        // Prevent unintended multiple uses
        if (this.abilityUsed) {
            return state;
        }
        // Check if ability is blocked
        if (prefabs_1.IS_ABILITY_BLOCKED(store, state, player, this)) {
            return state;
        }
        // Prevent prize card from going to hand until we complete the ability flow
        effect.preventDefault = true;
        // Ask player if they want to use the ability
        let wantToUse = false;
        yield prefabs_1.CONFIRMATION_PROMPT(store, state, player, result => {
            wantToUse = result;
            next();
        }, game_1.GameMessage.WANT_TO_USE_ABILITY_FROM_PRIZES);
        // If the player declines, move the original prize card to hand
        const prizeIndex = player.prizes.findIndex(prize => prize.cards.includes(this));
        const fallback = (prizeIndex) => {
            if (prizeIndex !== -1) {
                prefabs_1.TAKE_SPECIFIC_PRIZES(store, state, player, [player.prizes[prizeIndex]], { skipReduce: true });
            }
            return;
        };
        if (!wantToUse) {
            effect.preventDefault = false;
            fallback(prizeIndex);
            return state;
        }
        // We have an all clear, so let's move the card to bench
        // (Unfortunately, we have to check this again closer to the end of the flow
        // because due to how the generator pattern works, the player could have
        // played another card to the bench)
        const emptyBenchSlots = prefabs_1.GET_PLAYER_BENCH_SLOTS(player);
        if (emptyBenchSlots.length === 0) {
            effect.preventDefault = false;
            fallback(prizeIndex);
            return state;
        }
        // Now that we've confirmed the ability is allowed, we can update the state
        // (per wording of the ability, this still counts as a prize taken even if
        // it does not go to the player's hand)
        this.abilityUsed = true;
        player.prizesTaken += 1;
        const targetSlot = emptyBenchSlots[0];
        for (const [index, prize] of player.prizes.entries()) {
            if (prize.cards.includes(this)) {
                player.prizes[index].moveTo(targetSlot);
                targetSlot.pokemonPlayedTurn = state.turn;
                break;
            }
        }
        // Handle coin flip
        try {
            const coinFlip = new play_card_effects_1.CoinFlipEffect(player);
            store.reduceEffect(state, coinFlip);
        }
        catch (_a) {
            return state;
        }
        let coinResult = prefabs_1.SIMULATE_COIN_FLIP(store, state, player);
        if (!coinResult) {
            return state;
        }
        // Handle extra prize (excluding the group this card is in)
        yield prefabs_1.TAKE_X_PRIZES(store, state, player, 1, {
            promptOptions: {
                blocked: effect.prizes.map(p => player.prizes.indexOf(p))
            }
        }, () => next());
        return state;
    }
}
exports.Chansey = Chansey;
