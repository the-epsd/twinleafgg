"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Porygon extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 30;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.PSYCHIC, value: -30 }];
        this.retreat = [C];
        this.attacks = [{
                name: 'Conversion 1',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.'
            },
            {
                name: 'Conversion 2',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Change Porygon\'s Resistance to a type of your choice other than Colorless.'
            }
        ];
        this.set = 'BS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '39';
        this.name = 'Porygon';
        this.fullName = 'Porygon BS';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const options = [
                { value: card_types_1.CardType.DARK, message: 'Dark' },
                { value: card_types_1.CardType.DRAGON, message: 'Dragon' },
                { value: card_types_1.CardType.FAIRY, message: 'Fairy' },
                { value: card_types_1.CardType.FIGHTING, message: 'Fighting' },
                { value: card_types_1.CardType.FIRE, message: 'Fire' },
                { value: card_types_1.CardType.GRASS, message: 'Grass' },
                { value: card_types_1.CardType.LIGHTNING, message: 'Lightning' },
                { value: card_types_1.CardType.METAL, message: 'Metal' },
                { value: card_types_1.CardType.PSYCHIC, message: 'Psychic' },
                { value: card_types_1.CardType.WATER, message: 'Water' }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_TYPE, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (!option) {
                    return state;
                }
                const oppActive = opponent.active.getPokemonCard();
                if (oppActive) {
                    oppActive.weakness = [{ type: option.value }];
                }
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList.specialConditions.length > 0) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            const options = [
                { value: card_types_1.CardType.DARK, message: 'Dark' },
                { value: card_types_1.CardType.DRAGON, message: 'Dragon' },
                { value: card_types_1.CardType.FAIRY, message: 'Fairy' },
                { value: card_types_1.CardType.FIGHTING, message: 'Fighting' },
                { value: card_types_1.CardType.FIRE, message: 'Fire' },
                { value: card_types_1.CardType.GRASS, message: 'Grass' },
                { value: card_types_1.CardType.LIGHTNING, message: 'Lightning' },
                { value: card_types_1.CardType.METAL, message: 'Metal' },
                { value: card_types_1.CardType.PSYCHIC, message: 'Psychic' },
                { value: card_types_1.CardType.WATER, message: 'Water' }
            ];
            return store.prompt(state, new game_1.SelectPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGY_TYPE, options.map(c => c.message), { allowCancel: false }), choice => {
                const option = options[choice];
                if (!option) {
                    return state;
                }
                this.resistance = [{ type: option.value, value: -30 }];
            });
        }
        return state;
    }
}
exports.Porygon = Porygon;
