"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cofagrigus = void 0;
const pokemon_card_1 = require("../../game/store/card/pokemon-card");
const card_types_1 = require("../../game/store/card/card-types");
const game_1 = require("../../game");
const game_effects_1 = require("../../game/store/effects/game-effects");
const attack_effects_1 = require("../../game/store/effects/attack-effects");
const prefabs_1 = require("../../game/store/prefabs/prefabs");
class Cofagrigus extends pokemon_card_1.PokemonCard {
    constructor() {
        super(...arguments);
        this.stage = card_types_1.Stage.STAGE_1;
        this.evolvesFrom = 'Yamask';
        this.cardType = card_types_1.CardType.PSYCHIC;
        this.hp = 120;
        this.weakness = [{ type: card_types_1.CardType.DARK }];
        this.resistance = [{ type: card_types_1.CardType.FIGHTING, value: -30 }];
        this.retreat = [card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS];
        this.attacks = [
            {
                name: 'Law of the Underworld',
                cost: [card_types_1.CardType.PSYCHIC],
                damage: 0,
                text: 'Put 6 damage counters on each Pokémon that has an Ability (both yours and your opponent\'s).'
            },
            {
                name: 'Spooky Shot',
                cost: [card_types_1.CardType.PSYCHIC, card_types_1.CardType.COLORLESS, card_types_1.CardType.COLORLESS],
                damage: 100,
                text: ''
            },
        ];
        this.set = 'SSP';
        this.setNumber = '83';
        this.cardImage = 'assets/cardback.png';
        this.regulationMark = 'H';
        this.name = 'Cofagrigus';
        this.fullName = 'Cofagrigus SSP';
    }
    reduceEffect(store, state, effect) {
        // Law of the Underworld
        if (effect instanceof game_effects_1.AttackEffect && effect.attack === this.attacks[0]) {
            const player = effect.player;
            const opponent = game_1.StateUtils.getOpponent(state, player);
            player.forEachPokemon(game_1.PlayerType.BOTTOM_PLAYER, (cardList, card) => {
                if (card.powers.length > 0) {
                    if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, player, card)) {
                        const damageEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                        damageEffect.target = cardList;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
            opponent.forEachPokemon(game_1.PlayerType.TOP_PLAYER, (cardList, card) => {
                if (card.powers.length > 0) {
                    if (!prefabs_1.IS_ABILITY_BLOCKED(store, state, opponent, card)) {
                        const damageEffect = new attack_effects_1.PutCountersEffect(effect, 60);
                        damageEffect.target = cardList;
                        store.reduceEffect(state, damageEffect);
                    }
                }
            });
        }
        return state;
    }
}
exports.Cofagrigus = Cofagrigus;
