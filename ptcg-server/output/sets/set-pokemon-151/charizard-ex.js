"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charizardex = void 0;
/* eslint-disable indent */
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
class Charizardex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex];
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Charmeleon';
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 330;
        this.weakness = [{ type: card_types_1.CardType.WATER }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Brave Wing',
                cost: [card_types_1.CardType.FIRE],
                damage: 60,
                text: 'If this Pokémon has any damage counters on it, this attack ' +
                    'does 100 more damage.'
            },
            {
                name: 'Explosive Vortex',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE, card_types_1.CardType.FIRE],
                damage: 330,
                text: 'Discard 3 Energy from this Pokémon. '
            },
        ];
        this.set = '151';
        this.name = 'Charizard ex';
        this.fullName = 'Charizard ex';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const source = player.active;
            // Check if source Pokemon has damage
            const damage = source.damage;
            if (damage > 0) {
                effect.damage += 100;
            }
            if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
                const player = effect.player;
                const checkProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
                state = store.reduceEffect(state, checkProvidedEnergy);
                state = store.prompt(state, new game_1.ChooseEnergyPrompt(player.id, game_1.GameMessage.CHOOSE_ENERGIES_TO_DISCARD, checkProvidedEnergy.energyMap, [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS], { allowCancel: false }), energy => {
                    const cards = (energy || []).map(e => e.card);
                    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
                    discardEnergy.target = player.active;
                    return store.reduceEffect(state, discardEnergy);
                });
            }
            return state;
        }
        return state;
    }
}
exports.Charizardex = Charizardex;
