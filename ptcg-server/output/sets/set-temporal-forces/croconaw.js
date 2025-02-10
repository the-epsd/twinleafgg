"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Croconaw = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Croconaw extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Totodile';
        this.cardType = W;
        this.hp = 90;
        this.weakness = [{ type: L }];
        this.retreat = [C, C];
        this.attacks = [{
                name: 'Reverse Thrust',
                cost: [W],
                damage: 30,
                text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
            }];
        this.set = 'TEF';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '40';
        this.name = 'Croconaw';
        this.fullName = 'Croconaw TEF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof attack_effects_1.AfterDamageEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            prefabs_1.SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
            /*const hasBenched = player.bench.some(b => b.cards.length > 0);
            if (!hasBenched) {
              return state;
            }
      
            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.BENCH],
              { allowCancel: true },
            ), selected => {
              if (!selected || selected.length === 0) {
                return state;
              }
              const target = selected[0];
              player.switchPokemon(target);
            }); */
        }
        return state;
    }
}
exports.Croconaw = Croconaw;
