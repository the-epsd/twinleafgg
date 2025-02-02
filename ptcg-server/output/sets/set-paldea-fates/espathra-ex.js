"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Espathraex = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const check_effects_1 = require("../../game/store/effects/check-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Espathraex extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.tags = [card_types_1.CardTag.POKEMON_ex, card_types_1.CardTag.POKEMON_TERA];
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Flittle';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 260;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Dazzling Gaze',
                powerType: game_1.PowerType.ABILITY,
                text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon cost C more.'
            }];
        this.attacks = [
            {
                name: 'Psy Ball',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 30,
                damageCalculation: '+',
                text: 'This attack does 30 more damage for each Energy attached to both Active Pokémon.'
            }
        ];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '6';
        this.set = 'PAF';
        this.name = 'Espathra ex';
        this.fullName = 'Espathra ex PAF';
        this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof check_effects_1.CheckAttackCostEffect) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            const owner = game_1.StateUtils.findOwner(state, cardList);
            // Check if Espathra ex is in the active position
            if (owner.active.getPokemonCard() === this) {
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
                if (player !== owner && player.active.getPokemonCard()) {
                    const index = effect.cost.indexOf(card_types_1.CardType.COLORLESS);
                    if (index > -1) {
                        effect.cost.splice(index, 0, card_types_1.CardType.COLORLESS);
                    }
                    else {
                        effect.cost.push(card_types_1.CardType.COLORLESS);
                    }
                }
                return state;
            }
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const playerProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(player);
            store.reduceEffect(state, playerProvidedEnergy);
            const playerEnergyCount = playerProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            const opponentProvidedEnergy = new check_effects_1.CheckProvidedEnergyEffect(opponent);
            store.reduceEffect(state, opponentProvidedEnergy);
            const opponentEnergyCount = opponentProvidedEnergy.energyMap
                .reduce((left, p) => left + p.provides.length, 0);
            effect.damage += (playerEnergyCount + opponentEnergyCount) * 30;
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
exports.Espathraex = Espathraex;
