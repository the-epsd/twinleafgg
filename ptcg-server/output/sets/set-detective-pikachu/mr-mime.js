"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MrMime = void 0;
const game_1 = require("../../game");
const game_message_1 = require("../../game/game-message");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class MrMime extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = P;
        this.hp = 80;
        this.weakness = [{ type: P }];
        this.retreat = [C];
        this.powers = [{
                name: 'Pantomime',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may switch 1 of your face-down Prize cards with the top card of your deck.'
            }];
        this.attacks = [
            {
                name: 'Juggling',
                cost: [P, C],
                damage: 20,
                damageCalculation: 'x',
                text: 'Flip 4 coins. This attack does 20 damage for each heads.'
            }
        ];
        this.set = 'DET';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '11';
        this.name = 'Mr. Mime';
        this.fullName = 'Mr. Mime DET';
    }
    reduceEffect(store, state, effect) {
        // Pantomime
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const player = effect.player;
            if (prefabs_1.IS_ABILITY_BLOCKED(store, state, effect.player, effect.pokemonCard)) {
                return state;
            }
            prefabs_1.BLOCK_IF_DECK_EMPTY(effect.player);
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_message_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    prefabs_1.ABILITY_USED(player, this);
                    // Select prize to swap
                    return store.prompt(state, new game_1.ChoosePrizePrompt(player.id, game_message_1.GameMessage.CHOOSE_PRIZE_CARD, { count: 1, allowCancel: false, isSecret: true }), selected => {
                        const selectedPrizes = selected || [];
                        if (selectedPrizes.length > 0) {
                            const selectedPrize = selectedPrizes[0];
                            const prizeIndex = player.prizes.indexOf(selectedPrize);
                            // Move prize card to temp list
                            const tempList = new game_1.CardList();
                            selectedPrize.moveTo(tempList);
                            // Move card from deck to prizes face down at the original index
                            player.deck.moveTo(player.prizes[prizeIndex], 1);
                            player.prizes[prizeIndex].isSecret = true;
                            // Move prize card to top of deck
                            tempList.moveToTopOfDestination(player.deck);
                        }
                    });
                }
            });
        }
        // Juggling
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            return prefabs_1.MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
                let heads = 0;
                results.forEach(r => {
                    if (r)
                        heads++;
                });
                effect.damage = 20 * heads;
            });
        }
        return state;
    }
}
exports.MrMime = MrMime;
