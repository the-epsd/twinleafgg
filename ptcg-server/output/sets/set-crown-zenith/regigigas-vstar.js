"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegigigasVSTAR = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class RegigigasVSTAR extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.tags = [card_types_1.CardTag.POKEMON_VSTAR];
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 300;
        this.weakness = [{ type: card_types_1.CardType.FIGHTING }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Star Guardian',
                powerType: game_1.PowerType.ABILITY,
                text: 'During your turn, if your opponent has exactly 1 Prize card remaining, you may choose 1 of your opponent\'s Benched Pokémon. They discard that Pokémon and all attached cards. (You can\'t use more than 1 VSTAR Power in a game.)'
            }];
        this.attacks = [
            {
                name: 'Giga Impact',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 230,
                text: ''
            },
        ];
        this.set = 'CRZ';
        this.set2 = 'crownzenith';
        this.setNumber = '114';
        this.name = 'Regigigas VSTAR';
        this.fullName = 'Regigigas VSTAR CRZ';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (opponent.getPrizeLeft() === 1) {
                if (player.usedVSTAR == true) {
                    throw new game_1.GameError(game_1.GameMessage.POWER_ALREADY_USED);
                }
                player.usedVSTAR = true;
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { min: 1, max: 1, allowCancel: true }), selected => {
                    const targets = selected || [];
                    targets.forEach(target => {
                        target.moveTo(opponent.discard);
                    });
                    return state;
                });
            }
            return state;
        }
        return state;
    }
}
exports.RegigigasVSTAR = RegigigasVSTAR;
