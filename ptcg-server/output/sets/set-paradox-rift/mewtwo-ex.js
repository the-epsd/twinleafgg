"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mewtwoex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Mewtwoex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'G';
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 230;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Transfer Charge',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Attach up to 2 Basic P Energy from your discard pile to your Pokemon in any way you like.'
            },
            {
                name: 'Photon Kinesis',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.PSYCHIC],
                damage: 10,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each P Energy attached to all of your Pokémon.'
            },
        ];
        this.set = 'PAR';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '58';
        this.name = 'Mewtwo ex';
        this.fullName = 'Mewtwo ex PAR';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (cardList === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_ATTACH, player.discard, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC, name: 'Psychic Energy' }, { min: 0, max: 2, allowCancel: true }), cards => {
                cards = cards || [];
                if (cards.length > 0) {
                    player.discard.moveCardsTo(cards, cardList);
                }
                return state;
            });
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            let psychicEnergies = 0;
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                const checkProvidedEnergyEffect = new check_effects_1.CheckProvidedEnergyEffect(player, cardList);
                store.reduceEffect(state, checkProvidedEnergyEffect);
                checkProvidedEnergyEffect.energyMap.forEach(energy => {
                    if (energy.provides.includes(card_types_1.CardType.PSYCHIC)) {
                        psychicEnergies += 1;
                    }
                });
            });
            effect.damage = 10 + psychicEnergies * 30;
        }
        if (effect instanceof attack_effects_1.PutDamageEffect) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            // Target is not Active
            if (effect.target === player.active || effect.target === opponent.active) {
                return state;
            }
            // Target is this Pokemon
            if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
                effect.preventDefault = true;
            }
        }
        return state;
    }
}
exports.Mewtwoex = Mewtwoex;
