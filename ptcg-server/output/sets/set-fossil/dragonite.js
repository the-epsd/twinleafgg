"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dragonite = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Dragonite extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Dragonair';
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 100;
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Step In',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Once during your turn (before your attack), if Dragonite is on your Bench, you may switch it with your Active Pokémon.'
            }];
        this.attacks = [{
                name: 'Slam',
                cost: [C, C, C, C],
                damage: 40,
                damageCalculation: 'x',
                text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
            }];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '4';
        this.name = 'Dragonite';
        this.fullName = 'Dragonite FO';
        this.STEP_IN_MARKER = 'STEP_IN_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.active.cards[0] == this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            // Index of this Dragonite on bench
            const benchIndex = player.bench.indexOf(cardList);
            player.active.clearEffects();
            player.switchPokemon(player.bench[benchIndex]); // Switching this Dragonite with Active
            player.marker.addMarker(this.STEP_IN_MARKER, this);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this) {
                    cardList.addBoardEffect(card_types_1.BoardEffect.ABILITY_USED);
                }
            });
            return state;
        }
        if (effect instanceof game_phase_effects_1.EndTurnEffect && effect.player.marker.hasMarker(this.STEP_IN_MARKER, this)) {
            const player = effect.player;
            player.marker.removeMarker(this.STEP_IN_MARKER, this);
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP),
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                let heads = 0;
                results.forEach(r => { heads += r ? 1 : 0; });
                effect.damage = 40 * heads;
            });
            return state;
        }
        return state;
    }
}
exports.Dragonite = Dragonite;
