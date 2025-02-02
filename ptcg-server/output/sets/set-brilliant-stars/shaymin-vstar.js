"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShayminVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class ShayminVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'F';
        this.tags = [card_types_1.CardTag.POKEMON_V];
        this.stage = card_types_1.Stage.VSTAR;
        this.evolvesFrom = 'Shaymin V';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 250;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Star Bloom',
                useWhenInPlay: true,
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, you may heal 120 damage from each of your Benched [G] Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Revenge Blast',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS],
                damage: 120,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each Prize card your opponent has taken.'
            }
        ];
        this.set = 'BRS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '14';
        this.name = 'Shaymin VSTAR';
        this.fullName = 'Shaymin VSTAR BRS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            if (player.usedVSTAR === true) {
                throw new game_1.GameError(game_1.GameMessage.LABEL_VSTAR_USED);
            }
            // Heal each Benched Grass Pokemon by 120 damage
            player.bench.forEach(benchSpot => {
                const pokemonCard = benchSpot.getPokemonCard();
                if (pokemonCard && pokemonCard.cardType === card_types_1.CardType.GRASS) {
                    const healEffect = new game_effects_1.HealEffect(player, benchSpot, 120);
                    state = store.reduceEffect(state, healEffect);
                    player.usedVSTAR = true;
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const prizesTaken = 6 - opponent.getPrizeLeft();
            const damagePerPrize = 40;
            effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
        }
        return state;
    }
}
exports.ShayminVSTAR = ShayminVSTAR;
