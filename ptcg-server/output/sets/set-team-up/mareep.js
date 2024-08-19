"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mareep = void 0;
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Mareep extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.set = 'TEU';
        this.setNumber = '41';
        this.cardImage = 'assets/cardback.png';
        this.fullName = 'Mareep TEU';
        this.name = 'Mareep';
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.stage = card_types_1.Stage.BASIC;
        this.hp = 60;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.resistance = [{ type: card_types_1.CardType.METAL, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Shock Bolt',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 30,
                text: 'Discard all [L] Energy from this Pokémon.'
            }
        ];
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player, player.active);
            state = store.reduceEffect(state, checkProvidedEnergy);
            const cards = [];
            for (const energyMap of checkProvidedEnergy.energyMap) {
                const energy = energyMap.provides.filter(t => t === card_types_1.CardType.LIGHTNING || t === card_types_1.CardType.ANY || t === card_types_1.CardType.WLFM || t === card_types_1.CardType.LPM);
                if (energy.length > 0) {
                    cards.push(energyMap.card);
                }
            }
            const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);
        }
        return state;
    }
}
exports.Mareep = Mareep;
