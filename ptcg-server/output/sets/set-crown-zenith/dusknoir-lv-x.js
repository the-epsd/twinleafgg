"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DusknoirLvX = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* usePower(next, store, state, self, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    const cardList = game_1.StateUtils.findCardList(state, self);
    const benchIndex = player.bench.indexOf(cardList);
    if (benchIndex === -1) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
    }
    const pokemonCard = player.bench[benchIndex].getPokemonCard();
    if (pokemonCard !== self) {
        throw new game_1.GameError(game_1.GameMessage.ILLEGAL_ACTION);
    }
    if (player.stadium.cards.length > 0) {
        player.stadium.moveTo(player.discard);
    }
    if (opponent.stadium.cards.length > 0) {
        opponent.stadium.moveTo(opponent.discard);
    }
    store.log(state, game_1.GameLog.LOG_PLAYER_PLAYS_STADIUM, {
        name: effect.player.name,
        card: self.name,
    });
    player.stadiumUsedTurn = 0;
    player.bench[benchIndex].moveCardTo(pokemonCard, player.stadium);
    // Discard other cards
    player.bench[benchIndex].moveTo(player.discard);
    player.bench[benchIndex].clearEffects();
}
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
                powerType: game_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if Unown Q is on your ' +
                    'Bench, you may discard all cards attached to Unown Q and attach Unown Q ' +
                    'to 1 of your Pokemon as Pokemon Tool card. As long as Unown Q ' +
                    'is attached to a Pokemon, you pay C less to retreat that Pokemon.'
            }];
        this.set = 'SF';
        this.set2 = 'stormfront';
        this.setNumber = '96';
        this.name = 'Dusknoir Lv.X';
        this.fullName = 'DusknLv.X SF';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const generator = usePower(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.DusknoirLvX = DusknoirLvX;
