"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lycanroc = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Lycanroc extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Rockruff';
        this.regulationMark = 'I';
        this.cardType = F;
        this.hp = 120;
        this.weakness = [{ type: G }];
        this.resistance = [];
        this.retreat = [C, C];
        this.powers = [{
                name: 'Spike Cloak',
                powerType: game_1.PowerType.ABILITY,
                text: 'You may use this Ability when you play this Pokémon from your hand to evolve 1 of your Pokémon. ' +
                    'Attach up to 2 Spike Energy cards from your discard pile to this Pokémon.'
            }];
        this.attacks = [
            {
                name: 'Clutch Fang',
                cost: [C, C, C],
                damage: 40,
                damageCalculation: '+',
                text: 'This attack does 40 more damage for each damage counter on your opponent\'s Active Pokémon.'
            },
        ];
        this.set = 'SV9';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '52';
        this.name = 'Lycanroc';
        this.fullName = 'Lycanroc SV9';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.EvolveEffect && effect.pokemonCard === this) {
            prefabs_1.CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
                if (!result)
                    return;
                prefabs_1.ATTACH_ENERGY_PROMPT(store, state, effect.player, game_1.PlayerType.BOTTOM_PLAYER, game_1.SlotType.DISCARD, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { energyType: card_types_1.EnergyType.SPECIAL, name: 'Spike Energy' }, { min: 0, max: 1, allowCancel: false });
            });
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.active.damage > 0)
                effect.damage += (opponent.active.damage * 4);
        }
        return state;
    }
}
exports.Lycanroc = Lycanroc;
