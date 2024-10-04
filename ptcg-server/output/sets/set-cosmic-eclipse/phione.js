"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phione = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_types_1 = require("../../game/store/card/pokemon-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Phione extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.WATER;
        this.hp = 70;
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.weakness = [{ type: card_types_1.CardType.GRASS }];
        this.powers = [{
                name: 'Whirlpool Suction',
                useWhenInPlay: true,
                powerType: pokemon_types_1.PowerType.ABILITY,
                text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon. If you do, discard all cards attached to this Pokémon and put it on the bottom of your deck. '
            }];
        this.attacks = [{
                name: 'Rain Splash',
                cost: [card_types_1.CardType.WATER],
                damage: 10,
                text: ''
            }];
        this.set = 'CEC';
        this.setNumber = '57';
        this.cardImage = 'assets/cardback.png';
        this.name = 'Phione';
        this.fullName = 'Phione CEC';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.PowerEffect && effect.power === this.powers[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            const cardList = game_1.StateUtils.findCardList(state, this);
            if (player.active.cards[0] == this) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            if (hasBench === false) {
                return state;
            }
            const benchIndex = player.bench.indexOf(cardList);
            if (benchIndex === -1) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_POWER);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), targets => {
                if (targets && targets.length > 0) {
                    const deckBottom = new game_1.CardList();
                    opponent.active.clearEffects();
                    opponent.switchPokemon(targets[0]);
                    player.bench[benchIndex].moveTo(deckBottom);
                    player.bench[benchIndex].cards.forEach((c, index) => {
                        c.cards.moveTo(player.discard);
                    });
                    deckBottom.moveTo(player.deck);
                    player.bench[benchIndex].clearEffects();
                    return state;
                }
            });
        }
        return state;
    }
}
exports.Phione = Phione;
