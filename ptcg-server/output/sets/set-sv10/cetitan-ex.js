"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cetitanex = void 0;
const game_1 = require("../../game");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cetitanex extends game_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = game_1.Stage.STAGE_1;
        this.evolvesFrom = 'Cetoddle';
        this.tags = [game_1.CardTag.POKEMON_ex];
        this.cardType = W;
        this.hp = 300;
        this.weakness = [{ type: M }];
        this.retreat = [C, C, C, C];
        this.powers = [{
                name: 'Snow Cover',
                powerType: game_1.PowerType.ABILITY,
                text: 'Whenever your opponent plays an Item or Supporter card from their hand, prevent all effects of that card done to this Pokémon.'
            }];
        this.attacks = [{
                name: 'Crush Press',
                cost: [W, W, W, C],
                damage: 140,
                damageCalculation: '+',
                text: 'You may discard a Stadium in play. If you do, this attack does 140 more damage.'
            }];
        this.set = 'SV10';
        this.regulationMark = 'I';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '32';
        this.name = 'Cetitan ex';
        this.fullName = 'Cetitan ex SV10';
    }
    reduceEffect(store, state, effect) {
        var _a;
        // Snow Cover
        if ((effect instanceof play_card_effects_1.PlayItemEffect || effect instanceof play_card_effects_1.PlaySupporterEffect) && ((_a = effect.target) === null || _a === void 0 ? void 0 : _a.cards.includes(this))) {
            effect.preventDefault = true;
        }
        // Crush Press
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            if (game_1.StateUtils.getStadiumCard(state) === undefined) {
                return state;
            }
            return store.prompt(state, new game_1.ConfirmPrompt(effect.player.id, game_1.GameMessage.WANT_TO_USE_ABILITY), wantToUse => {
                if (wantToUse) {
                    prefabs_1.DISCARD_A_STADIUM_CARD_IN_PLAY(state);
                    effect.damage += 140;
                }
            });
        }
        return state;
    }
}
exports.Cetitanex = Cetitanex;
