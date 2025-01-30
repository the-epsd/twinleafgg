"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aerodactyl = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Aerodactyl extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mysterious Fossil';
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [
            {
                name: 'Prehistoric Power',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'No more Evolution cards can be played. This power stops working while Aerodactyl is Asleep, Confused, or Paralyzed.',
            },
        ];
        this.attacks = [
            {
                name: 'Wing Attack',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: '',
            },
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '1';
        this.name = 'Aerodactyl';
        this.fullName = 'Aerodactyl FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            let isAerodactylInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAerodactylInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isAerodactylInPlay = true;
                }
            });
            if (!isAerodactylInPlay) {
                return state;
            }
            if (isAerodactylInPlay) {
                const cardList = game_1.StateUtils.findCardList(state, this);
                if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                    cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                    cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                    return state;
                }
                // Try reducing ability
                try {
                    const stub = new game_effects_1.PowerEffect(player, {
                        name: 'test',
                        powerType: game_1.PowerType.POKEMON_POWER,
                        text: ''
                    }, this);
                    store.reduceEffect(state, stub);
                }
                catch (_a) {
                    return state;
                }
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        return state;
    }
}
exports.Aerodactyl = Aerodactyl;
