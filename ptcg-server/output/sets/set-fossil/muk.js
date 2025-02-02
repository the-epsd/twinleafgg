"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Muk = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Muk extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Grimer';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 70;
        this.weakness = [{ type: P }];
        this.resistance = [];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Toxic Gas',
                powerType: game_1.PowerType.POKEMON_POWER,
                text: 'Ignore all Pokémon Powers other than Toxic Gases. This power stops working while Muk is Asleep, Confused, or Paralyzed.'
            }];
        this.attacks = [
            {
                name: 'Sludge',
                cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.GRASS],
                damage: 30,
                text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
            }
        ];
        this.set = 'FO';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '13';
        this.name = 'Muk';
        this.fullName = 'Muk FO';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power.powerType === game_1.PowerType.POKEMON_POWER && effect.power.name !== 'Toxic Gas') {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.includes(card_types_1.SpecialCondition.ASLEEP) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.CONFUSED) ||
                cardList.specialConditions.includes(card_types_1.SpecialCondition.PARALYZED)) {
                return state;
            }
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, cardList => {
                if (cardList.getPokemonCard() === this && cardList.specialConditions.length > 0) {
                    return state;
                }
            });
            let isMukInPlay = false;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card === this) {
                    isMukInPlay = true;
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card === this) {
                    isMukInPlay = true;
                }
            });
            if (!isMukInPlay) {
                return state;
            }
            // Try reducing ability for each player  
            try {
                const powerEffect = new game_effects_1.PowerEffect(player, this.powers[0], this);
                store.reduceEffect(state, powerEffect);
            }
            catch (_a) {
                return state;
            }
            if (!effect.power.exemptFromAbilityLock) {
                throw new game_1.GameError(game_1.GameMessage.BLOCKED_BY_ABILITY);
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            state = store.prompt(state, [
                new game_1.CoinFlipPrompt(player.id, game_1.GameMessage.COIN_FLIP)
            ], results => {
                if (results) {
                    const specialConditionEffect = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.POISONED]);
                    store.reduceEffect(state, specialConditionEffect);
                }
            });
            return state;
        }
        return state;
    }
}
exports.Muk = Muk;
