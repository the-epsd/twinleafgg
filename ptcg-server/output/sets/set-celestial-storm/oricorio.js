"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oricorio = void 0;
const game_1 = require("../../game");
const card_types_1 = require("../../game/store/card/card-types");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const game_effects_1 = require("../../game/store/effects/game-effects");
class Oricorio extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.FIRE;
        this.hp = 90;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -20 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Captivating Salsa',
                cost: [card_types_1.CardType.FIRE],
                damage: 0,
                text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon. The new Active Poekmon is now Burned and Confused.'
            },
            {
                name: 'Heat Blast',
                cost: [card_types_1.CardType.FIRE, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 70,
                text: ''
            }
        ];
        this.set = 'CES';
        this.name = 'Oricorio';
        this.fullName = 'Oricorio SHF';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '30';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            const hasBench = opponent.bench.some(b => b.cards.length > 0);
            if (!hasBench) {
                throw new game_1.GameError(game_1.GameMessage.CANNOT_USE_ATTACK);
            }
            return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_SWITCH, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false }), result => {
                const cardList = result[0];
                const gustOpponentBenchEffect = new attack_effects_1.GustOpponentBenchEffect(effect, cardList);
                store.reduceEffect(state, gustOpponentBenchEffect);
                opponent.switchPokemon(cardList);
                const active = opponent.active;
                active.addSpecialCondition(card_types_1.SpecialCondition.BURNED);
                active.addSpecialCondition(card_types_1.SpecialCondition.CONFUSED);
            });
        }
        return state;
    }
}
exports.Oricorio = Oricorio;
