"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const __1 = require("../..");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Gengar extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        //   public evolvesFrom = 'Haunter';
        this.cardType = card_types_1.CardType.DARK;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Night Gate',
                powerType: __1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn, you may switch your Active Pokémon with 1 of your Benched Pokémon.'
            }];
        this.attacks = [{
                name: 'Nightmare',
                cost: [card_types_1.CardType.DARK, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: 'Your opponent’s Active Pokémon is now Asleep.'
            }];
        this.regulationMark = 'G';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '35';
        this.set = 'SV4';
        this.name = 'Gengar';
        this.fullName = 'Gengar SV4';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const hasBench = player.bench.some(b => b.cards.length > 0);
            if (hasBench === false) {
                throw new __1.GameError(__1.GameMessage.CANNOT_PLAY_THIS_CARD);
            }
            let targets = [];
            store.prompt(state, new __1.ChoosePokemonPrompt(player.id, __1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, __1.PlayerType.BOTTOM_PLAYER, [__1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), results => {
                targets = results || [];
            });
            if (targets.length === 0) {
                return state;
            }
            player.active.clearEffects();
            player.switchPokemon(player.active);
            return state;
        }
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const specialCondition = new attack_effects_1.AddSpecialConditionsEffect(effect, [card_types_1.SpecialCondition.ASLEEP]);
            store.reduceEffect(state, specialCondition);
            return state;
        }
        return state;
    }
}
exports.Gengar = Gengar;
