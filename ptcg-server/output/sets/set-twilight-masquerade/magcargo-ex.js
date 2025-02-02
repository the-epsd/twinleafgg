"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magcargoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Magcargoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [game_1.CardTag.POKEMON_ex, game_1.CardTag.POKEMON_TERA];
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Slugma';
        this.cardType = R;
        this.hp = 270;
        this.weakness = [{ type: W }];
        this.retreat = [C, C, C];
        this.attacks = [
            {
                name: 'Hot Magma',
                cost: [R, C],
                damage: 70,
                text: 'Your opponent\'s Active Pokémon is now Burned.'
            },
            {
                name: 'Ground Burn',
                cost: [R, R, C],
                damage: 140,
                damageCalculation: '+',
                text: 'Discard the top card of each player\'s deck. This attack does 140 more damage for each Energy card discarded in this way.'
            }
        ];
        this.set = 'TWM';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '29';
        this.name = 'Magcargo ex';
        this.fullName = 'Magcargo ex TWM';
    }
    reduceEffect(store, state, effect) {
        // Hot Magma
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [game_1.SpecialCondition.BURNED]);
            return store.reduceEffect(state, specialCondition);
        }
        // Ground Burn
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerTopDeck = new game_1.CardList();
            const opponentTopDeck = new game_1.CardList();
            let damageScaling = 0;
            player.deck.moveTo(playerTopDeck, 1);
            opponent.deck.moveTo(opponentTopDeck, 1);
            if (playerTopDeck.cards[0] instanceof game_1.EnergyCard) {
                damageScaling++;
            }
            if (opponentTopDeck.cards[0] instanceof game_1.EnergyCard) {
                damageScaling++;
            }
            effect.damage += (140 * damageScaling);
            playerTopDeck.moveTo(player.discard);
            opponentTopDeck.moveTo(opponent.discard);
        }
        return state;
    }
}
exports.Magcargoex = Magcargoex;
