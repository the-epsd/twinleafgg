"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tyrogue = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_phase_effects_1 = require("../../game/store/effects/game-phase-effects");
class Tyrogue extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIGHTING;
        this.hp = 60;
        this.retreat = [];
        this.powers = [{
                name: 'Bratty Kick',
                powerType: game_1.PowerType.ABILITY,
                useWhenInPlay: true,
                text: 'Once during your turn (before your attack), you may flip a coin. If heads, put 3 damage counters on 1 of your opponent\'s Pokémon. If you use this Ability, your turn ends.'
            }];
        this.set = 'UNB';
        this.name = 'Tyrogue';
        this.fullName = 'Tyrogue UNB';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '100';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: false }), selected => {
                const targets = selected || [];
                targets.forEach(target => {
                    target.damage += 30;
                });
                const endTurnEffect = new game_phase_effects_1.EndTurnEffect(player);
                store.reduceEffect(state, endTurnEffect);
                return state;
            });
        }
        return state;
    }
}
exports.Tyrogue = Tyrogue;
