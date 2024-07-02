"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unown = void 0;
const game_message_1 = require("../../game/game-message");
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
function* useReturn(next, store, state, self, effect) {
    const player = effect.player;
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        const stub = new game_effects_1.PowerEffect(player, {
            name: 'test',
            powerType: game_1.PowerType.ABILITY,
            text: ''
        }, self);
        store.reduceEffect(state, stub);
    }
    catch (_a) {
        return state;
    }
    let targets = [];
    yield store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_message_1.GameMessage.CHOOSE_POKEMON_TO_PICK_UP, game_1.PlayerType.BOTTOM_PLAYER, [game_1.SlotType.ACTIVE, game_1.SlotType.BENCH], { allowCancel: true }), selection => {
        targets = selection || [];
        next();
    });
    if (targets.length === 0) {
        return state;
    }
    const energyCards = targets[0].cards.filter(c => c.superType === card_types_1.SuperType.ENERGY);
    targets[0].moveCardsTo(energyCards, player.hand);
    return state;
}
class Unown extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 50;
        this.weakness = [{ type: card_types_1.CardType.PSYCHIC }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Return',
                powerType: game_1.PowerType.POKEPOWER,
                text: 'Once during your turn, when you put Unown from your hand onto ' +
                    'your Bench, you may return all Energy attached to 1 of your Pokemon ' +
                    'to your hand.'
            }];
        this.attacks = [
            {
                name: 'Hidden Power',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 10,
                text: ''
            }
        ];
        this.set = 'HS';
        this.name = 'Unown';
        this.fullName = 'Unown HS';
        this.cardImage = 'assets/cardback.png';
        this.setNumber = '54';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useReturn(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        return state;
    }
}
exports.Unown = Unown;
