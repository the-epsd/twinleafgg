"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eevee = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useColorfulCatch(next, store, state, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        throw new game_1.GameError(game_1.GameMessage.CANNOT_PLAY_THIS_CARD);
    }
    const maxEnergies = 3;
    const uniqueBasicEnergies = Math.min(maxEnergies, player.deck.cards
        .filter(c => c.superType === card_types_1.SuperType.ENERGY && c.energyType === card_types_1.EnergyType.BASIC)
        .map(e => e.provides[0])
        .filter((value, index, self) => self.indexOf(value) === index)
        .length);
    let cards = [];
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.ENERGY, energyType: card_types_1.EnergyType.BASIC }, { min: 0, max: uniqueBasicEnergies, allowCancel: false, differentTypes: true }), selected => {
        cards = selected || [];
        if (selected.length > 1) {
            if (selected[0].name === selected[1].name) {
                throw new game_1.GameError(game_1.GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
            }
        }
        player.deck.moveCardsTo(cards, player.hand);
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Eevee extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = C;
        this.hp = 70;
        this.weakness = [{ type: F }];
        this.retreat = [C];
        this.attacks = [
            {
                name: 'Colorful Catch',
                cost: [C],
                damage: 0,
                text: 'Search your deck for up to 3 Basic Energy cards of different types, ' +
                    'reveal them, and put them into your hand. Then, shuffle your deck.'
            },
            { name: 'Headbutt', cost: [C, C], damage: 20, text: '' },
        ];
        this.regulationMark = 'H';
        this.set = 'SFA';
        this.name = 'Eevee';
        this.fullName = 'Eevee SFA';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '50';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const generator = useColorfulCatch(() => generator.next(), store, state, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Eevee = Eevee;
