"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flamigo = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const play_card_effects_1 = require("../../game/store/effects/play-card-effects");
const attack_effects_1 = require("../../game/store/prefabs/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
function* useLeParfum(next, store, state, self, effect) {
    const player = effect.player;
    if (player.deck.cards.length === 0) {
        return state;
    }
    // Try to reduce PowerEffect, to check if something is blocking our ability
    try {
        const powerEffect = new game_effects_1.PowerEffect(player, self.powers[0], self);
        store.reduceEffect(state, powerEffect);
    }
    catch (_a) {
        return state;
    }
    yield store.prompt(state, new game_1.ChooseCardsPrompt(player.id, game_1.GameMessage.CHOOSE_CARD_TO_HAND, player.deck, { superType: card_types_1.SuperType.POKEMON, stage: card_types_1.Stage.BASIC, name: 'Flamigo' }, { min: 0, max: 3, allowCancel: true }), selected => {
        const cards = selected || [];
        player.deck.moveCardsTo(cards, player.hand);
        next();
    });
    return store.prompt(state, new game_1.ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
    });
}
class Flamigo extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.regulationMark = 'G';
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.COLORLESS;
        this.hp = 110;
        this.weakness = [{ type: card_types_1.CardType.LIGHTNING }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS];
        this.powers = [{
                name: 'Le Parfum',
                powerType: game_1.PowerType.ABILITY,
                text: 'When you play this Pokemon from your hand onto your ' +
                    'Bench during your turn, you may search your deck for up ' +
                    'to 3 Flamigo, reveal them, and put them into your hand.' +
                    'Then, shuffle your deck.'
            }];
        this.attacks = [
            {
                name: 'United Wings',
                cost: [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 20,
                text: 'This attack does 20 damage for each Pokémon in your ' +
                    'in your discard pile that have the United Wings attack.'
            }
        ];
        this.set = 'PAL';
        this.set2 = 'paldeaevolved';
        this.setNumber = '170';
        this.name = 'Flamigo';
        this.fullName = 'Flamigo PAL';
    }
    reduceEffect(store, state, effect) {
        if (effect instanceof play_card_effects_1.PlayPokemonEffect && effect.pokemonCard === this) {
            const generator = useLeParfum(() => generator.next(), store, state, this, effect);
            return generator.next().value;
        }
        if (prefabs_1.WAS_ATTACK_USED(effect, 0, this)) {
            attack_effects_1.THIS_ATTACK_DOES_X_DAMAGE_FOR_EACH_POKEMON_IN_YOUR_DISCARD_PILE(20, c => c.attacks.some(a => a.name === 'United Wings'), effect);
        }
        return state;
    }
}
exports.Flamigo = Flamigo;
