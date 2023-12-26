"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DusknoirLvX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
class DusknoirLvX extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 300;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC, value: 10 }];
        this.retreat = [];
        this.powers = [{
                name: 'Quick',
                useWhenInPlay: true,
                powerType: game_1.PowerType.POKEPOWER,
                text: 'If Dusknoir is your Active Pokémon and would be Knocked Out by damage from your opponent\'s attack, you may discard all cards attached to Dusknoir LV.X and put Dusknoir LV.X as a Stadium card into play instead of discarding it. This counts as Dusknoir being Knocked Out and your opponent takes a Prize card. As long as you have Dusknoir LV.X as a Stadium card in play, put 1 damage counter on each of your opponent\'s Pokémon between turns. If another Stadium card comes into play or Dusknoir LV.X is discarded by the effects of any attacks, Poké-Powers, Poké-Bodies, Trainer, or Supporter cards, return Dusknoir LV.X to your hand.'
            }];
        this.set = 'SF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '96';
        this.name = 'Dusknoir Lv.X';
        this.fullName = 'DusknLv.X SF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const cardList = game_1.StateUtils.findCardList(state, this);
            // check if UnownR is on player's Bench
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            player.bench[benchIndex].clearEffects();
            effect instanceof play_card_effects_1.PlayStadiumEffect && effect.card == this;
            {
                // player.bench[benchIndex].moveTo(player.stadium);
                if (state.phase == game_1.GamePhase.ATTACK) {
                    const opponent = game_1.StateUtils.getOpponent(state, player);
                    opponent.active.damage += 10;
                    opponent.bench.forEach(b => b.damage += 10);
                }
                if (effect instanceof play_card_effects_1.PlayStadiumEffect && effect.card !== this) {
                    effect.player.stadium.moveTo(effect.player.hand);
                    return state;
                }
                return state;
            }
            return state;
        }
        return state;
    }
}
exports.DusknoirLvX = DusknoirLvX;
