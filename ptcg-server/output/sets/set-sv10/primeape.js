"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primeape = void 0;
const game_1 = require("../../game");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Primeape extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Mankey';
        this.cardType = F;
        this.hp = 110;
        this.weakness = [{ type: P }];
        this.retreat = [C, C];
        this.attacks = [
            {
                name: 'Drag Off',
                cost: [C],
                damage: 0,
                text: 'Switch in 1 of your opponent\'s Benched Pokémon to the Active Spot. This attack does 30 damage to the new Active Pokémon.'
            }
        ];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '46';
        this.name = 'Primeape';
        this.fullName = 'Primeape SV10';
    }
    reduceEffect(store, state, effect) {
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            const player = effect.player;
            const opponent = effect.opponent;
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                return state;
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                opponent.switchPokemon(cardList);
                const afterDamage = new attack_effects_1.DealDamageEffect(effect, 30);
                afterDamage.target = opponent.active;
                store.reduceEffect(state, afterDamage);
            });
        }
        return state;
    }
}
exports.Primeape = Primeape;
