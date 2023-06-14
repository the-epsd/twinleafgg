"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meowscarada = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const game_message_1 = require("../../game/game-message");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
function* useTrickCape(next, store, state, effect) {
    const player = effect.player;
    const opponent = game_1.StateUtils.getOpponent(state, player);
    // Defending Pokemon has no energy cards attached
    if (!opponent.active.cards.some(c => c instanceof game_1.EnergyCard)) {
        return state;
    }
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_message_1.GameMessage.CHOOSE_CARD_TO_HAND, opponent.active, { superType: card_types_1.SuperType.ENERGY }, { min: 1, max: 1, allowCancel: false }), selected => {
        cards = selected || [];
        next();
    });
    const discardEnergy = new attack_effects_1.DiscardCardsEffect(effect, cards);
    return store.reduceEffect(state, discardEnergy);
}
class Meowscarada extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_2;
        this.evolvesFrom = 'Floragato';
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 160;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Trick Cape',
                cost: [ card_types_1.CardType.COLORLESS ],
                damage: 40,
                text: 'You may put an Energy attached to your opponent\'s Active ' +
                'Pokémon into their hand. '
            },
            {
                name: 'Flower Blast',
                cost: [ card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS ],
                damage: 130,
                text: ''
            }
        ];
        this.set = 'SVI';
        this.name = 'Meowscarada';
        this.fullName = 'Meowscarada SVI 15';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useTrickCape(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Meowscarada = Meowscarada;
