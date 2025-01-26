"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minun = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class Minun extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Buddy Pulse',
                powerType: game_1.PowerType.ABILITY,
                text: 'If you have Plusle in play, whenever your opponent attaches an Energy card from their hand to 1 of their Pokémon, put 2 damage counters on that Pokémon. The effect of Buddy Pulse doesn\'t stack.'
            }];
        this.attacks = [{
                name: 'Speed Ball',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 20,
                text: '',
            }];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '61';
        this.name = 'Minun';
        this.regulationMark = 'G';
        this.fullName = 'Minun PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.AttachEnergyEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let hasMinunInPlay = false;
            opponent.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    hasMinunInPlay = true;
                }
            });
            if (!hasMinunInPlay) {
                return state;
            }
            try {
                const stub = new game_effects_1.PowerEffect(player, {
                    name: 'test',
                    powerType: game_1.PowerType.ABILITY,
                    text: ''
                }, this);
                store.reduceEffect(state, stub);
            }
            catch (_a) {
                return state;
            }
            const plusleIsOnBench = player.bench.some(c => c.cards.some(card => card.name === 'Plusle'));
            if (!plusleIsOnBench) {
                return state;
            }
            store.log(state, game_1.GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, { name: opponent.name, damage: 20, target: effect.target.getPokemonCard().name, effect: this.name });
            effect.target.damage += 20;
            return state;
        }
        return state;
    }
}
exports.Minun = Minun;
