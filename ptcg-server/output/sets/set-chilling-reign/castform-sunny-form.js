"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CastformSunnyForm = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class CastformSunnyForm extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.regulationMark = 'E';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 70;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.resistance = [];
        this.retreat = [];
        this.powers = [
            {
                name: 'Weather Reading',
                text: 'If you have 8 or more Stadium cards in your discard pile, ignore all Energy in this Pokémon\'s attack costs.',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: false,
            }
        ];
        this.attacks = [
            {
                name: 'High-Pressure Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS],
                damage: 150,
                text: 'Discard a Stadium in play. If you can\'t, this attack does nothing.'
            }
        ];
        this.set = 'CRE';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '22';
        this.name = 'Castform Sunny Form';
        this.fullName = 'Castform Sunny Form CRE';
    }
    getColorlessReduction(state) {
        const player = state.players[state.activePlayer];
        const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
        return stadiumsInDiscard >= 8 ? 2 : 0;
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const stadiumsInDiscard = player.discard.cards.filter(c => c instanceof game_1.TrainerCard && c.trainerType === card_types_1.TrainerType.STADIUM).length;
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
            if (stadiumsInDiscard >= 8) {
                const costToRemove = 3;
                for (let i = 0; i < costToRemove; i++) {
                    let index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index !== -1) {
                        effect.cost.splice(index, 1);
                    }
                    else {
                        index = effect.cost.indexOf(card_types_1.CardType.FIRE);
                        if (index !== -1) {
                            effect.cost.splice(index, 1);
                        }
                    }
                }
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            // Check attack cost
            const checkCost = new check_effects_1.CheckAttackCostEffect(player, this.attacks[0]);
            state = store.reduceEffect(state, checkCost);
            // Check attached energy
            const checkEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkEnergy);
            const stadiumCard = game_1.StateUtils.getStadiumCard(state);
            if (stadiumCard !== undefined) {
                const cardList = game_1.StateUtils.findCardList(state, stadiumCard);
                const player = game_1.StateUtils.findOwner(state, cardList);
                cardList.moveTo(player.discard);
                return state;
            }
            else {
                effect.damage = 0;
            }
        }
        return state;
    }
}
exports.CastformSunnyForm = CastformSunnyForm;
