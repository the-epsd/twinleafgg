"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wochien = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
class Wochien extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.BASIC;
        this.cardType = card_types_1.CardType.GRASS;
        this.hp = 130;
        this.weakness = [{ type: card_types_1.CardType.FIRE }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            { name: 'Hazardous Greed', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 20, text: 'If there are 3 or fewer cards in your deck, this attack also does 120 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)' },
            { name: 'Entangling Whip', cost: [card_types_1.CardType.GRASS, card_types_1.CardType.GRASS, card_types_1.CardType.COLORLESS], damage: 130, text: 'Discard the top 3 cards of your deck.' }
        ];
        this.set = 'SSP';
        this.name = 'Wo-chien';
        this.fullName = 'Wo-chien SSP';
        this.setNumber = '15';
        this.regulationMark = 'H';
        this.cardImage = 'assets/cardback.png';
    }
    reduceEffect(store, state, effect) {
        // Hazardous Greed
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            if (player.deck.cards.length <= 3) {
                const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
                if (benched === 0) {
                    return state;
                }
                const count = Math.min(2, benched);
                return store.prompt(state, new game_1.ChoosePokemonPrompt(player.id, game_1.GameMessage.CHOOSE_POKEMON_TO_DAMAGE, game_1.PlayerType.TOP_PLAYER, [game_1.SlotType.BENCH], { allowCancel: false, min: count, max: count }), targets => {
                    targets.forEach(target => {
                        const damageEffect = new attack_effects_1.PutDamageEffect(effect, 120);
                        damageEffect.target = target;
                        store.reduceEffect(state, damageEffect);
                    });
                });
            }
        }
        // Entangling Whip
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[1]) {
            const player = effect.player;
            player.deck.moveTo(player.discard, 3);
        }
        return state;
    }
}
exports.Wochien = Wochien;
