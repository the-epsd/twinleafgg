"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lampent = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Lampent extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Litwick';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 80;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [{
                name: 'Luring Light',
                cost: [card_types_1.CardType.COLORLESS],
                damage: 0,
                text: 'Switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon.'
            },
            {
                name: 'Will-O-Wisp',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS],
                damage: 30,
                text: ''
            }];
        this.set = 'NVI';
        this.name = 'Lampent';
        this.fullName = 'Lampent NVI';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '59';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!opponentHasBench) {
                return state;
            }
            let targets = [];
            if (opponentHasBench) {
                return store.prompt(state, new game_1.ChoosePokemonPrompt(opponent.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), results => {
                    targets = results || [];
                    if (targets.length > 0) {
                        opponent.active.clearEffects();
                        opponent.switchPokemon(targets[0]);
                    }
                });
            }
        }
        return state;
    }
}
exports.Lampent = Lampent;
