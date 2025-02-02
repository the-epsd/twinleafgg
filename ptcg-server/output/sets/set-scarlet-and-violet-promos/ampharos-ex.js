"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ampharosex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Ampharosex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Flaaffy';
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.cardType = card_types_1.CardType.LIGHTNING;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Electro Ball',
                cost: [card_types_1.CardType.LIGHTNING],
                damage: 60,
                text: ''
            },
            {
                name: 'Thunderstrike Tail',
                cost: [card_types_1.CardType.LIGHTNING, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 140,
                damageCalculation: '+',
                text: 'You may discard 2 Energy from this Pokémon to have this attack do 100 more damage.'
            }
        ];
        this.set = 'SVP';
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '16';
        this.name = 'Ampharos ex';
        this.fullName = 'Ampharos ex SVP';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            state = store.prompt(state, new __1.ConfirmPrompt(effect.player.id, __1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                    state = store.reduceEffect(state, checkProvidedEnergy);
                    state = store.prompt(state, new __1.ChooseEnergyPrompt(player.id, __1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                        const cards = (energy || []).map(e => e.card);
                        const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                        discardEnergy.target = player.active;
                        store.reduceEffect(state, discardEnergy);
                        effect.damage += 100;
                        return state;
                    });
                    return state;
                }
                return state;
            });
            return state;
        }
        return state;
    }
}
exports.Ampharosex = Ampharosex;
